#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, vec, Address, Bytes, Env, String, Vec,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EncryptedDocument {
    pub id: u32,
    pub owner: Address,
    pub encrypted_content: Bytes,          // Encrypted document content
    pub name: String,                      // Document name/identifier
    pub encrypted_metadata: Option<Bytes>, // Optional encrypted metadata
    pub created_at: u64,                   // Timestamp
    pub updated_at: u64,                   // Timestamp
    pub tags: Vec<String>,                 // Tags for categorization/search
}

#[contract]
pub struct DocumentStorage;

#[contractimpl]
impl DocumentStorage {
    /// Initialize the contract
    pub fn init(_env: Env) {
        // No initialization needed
    }

    /// Store a new encrypted document
    /// Returns the document_id that was assigned
    pub fn store_document(
        env: Env,
        owner: Address,
        encrypted_content: Bytes,
        name: String,
        encrypted_metadata: Option<Bytes>,
        tags: Vec<String>,
    ) -> u32 {
        // Check authorization - only the owner can store documents for themselves
        owner.require_auth();

        // Get the next document ID for this owner
        let next_doc_id_key = symbol_short!("next_id");
        let owner_key = (next_doc_id_key, owner.clone());

        let current_next_id: u32 = env.storage().persistent().get(&owner_key).unwrap_or(0);

        let document_id = current_next_id;
        let new_next_id = document_id + 1;

        // Store the next document ID for this owner
        env.storage().persistent().set(&owner_key, &new_next_id);

        // Get current timestamp
        let timestamp = env.ledger().timestamp();

        // Create the encrypted document
        let document = EncryptedDocument {
            id: document_id,
            owner: owner.clone(),
            encrypted_content: encrypted_content.clone(),
            name: name.clone(),
            encrypted_metadata: encrypted_metadata.clone(),
            created_at: timestamp,
            updated_at: timestamp,
            tags: tags.clone(),
        };

        // Store the document using (owner, document_id) as key
        let document_key = (owner.clone(), document_id);
        env.storage().persistent().set(&document_key, &document);

        // Get the owner's documents list key
        let docs_list_key = symbol_short!("docs");
        let owner_docs_key = (docs_list_key, owner);

        // Get existing documents for this owner
        let mut document_ids: Vec<u32> = env
            .storage()
            .persistent()
            .get(&owner_docs_key)
            .unwrap_or_else(|| vec![&env]);

        // Add the new document_id to the list
        document_ids.push_back(document_id);
        env.storage()
            .persistent()
            .set(&owner_docs_key, &document_ids);

        document_id
    }

    /// Get a specific document by ID
    pub fn get_document(env: Env, owner: Address, document_id: u32) -> Option<EncryptedDocument> {
        let document_key = (owner, document_id);
        env.storage().persistent().get(&document_key)
    }

    /// Get all documents for a specific owner
    pub fn get_user_documents(env: Env, owner: Address) -> Vec<EncryptedDocument> {
        let docs_list_key = symbol_short!("docs");
        let owner_docs_key = (docs_list_key, owner.clone());

        // Get the list of document IDs for this owner
        let document_ids: Vec<u32> = env
            .storage()
            .persistent()
            .get(&owner_docs_key)
            .unwrap_or_else(|| vec![&env]);

        // Build vector of documents
        let mut documents = vec![&env];
        for i in 0..document_ids.len() {
            if let Some(doc_id) = document_ids.get(i) {
                let document_key = (owner.clone(), doc_id);
                if let Some(document) = env.storage().persistent().get(&document_key) {
                    documents.push_back(document);
                }
            }
        }

        documents
    }

    /// Update an existing document
    pub fn update_document(
        env: Env,
        owner: Address,
        document_id: u32,
        encrypted_content: Option<Bytes>,
        name: Option<String>,
        encrypted_metadata: Option<Bytes>,
        tags: Option<Vec<String>>,
    ) -> bool {
        // Check authorization - only the owner can update their documents
        owner.require_auth();

        let document_key = (owner.clone(), document_id);

        // Get existing document
        if let Some(mut document) = env
            .storage()
            .persistent()
            .get::<_, EncryptedDocument>(&document_key)
        {
            // Verify ownership
            if document.owner != owner {
                return false;
            }

            // Update fields if provided
            if let Some(content) = encrypted_content {
                document.encrypted_content = content;
            }
            if let Some(new_name) = name {
                document.name = new_name;
            }
            if let Some(metadata) = encrypted_metadata {
                document.encrypted_metadata = Some(metadata);
            }
            if let Some(new_tags) = tags {
                document.tags = new_tags;
            }

            // Update timestamp
            document.updated_at = env.ledger().timestamp();

            // Store updated document
            env.storage().persistent().set(&document_key, &document);
            true
        } else {
            false
        }
    }

    /// Delete a specific document
    pub fn delete_document(env: Env, owner: Address, document_id: u32) -> bool {
        // Check authorization - only the owner can delete their documents
        owner.require_auth();

        let document_key = (owner.clone(), document_id);

        // Check if document exists and verify ownership
        if let Some(document) = env
            .storage()
            .persistent()
            .get::<_, EncryptedDocument>(&document_key)
        {
            if document.owner != owner {
                return false;
            }

            // Remove the document
            env.storage().persistent().remove(&document_key);

            // Remove from owner's documents list
            let docs_list_key = symbol_short!("docs");
            let owner_docs_key = (docs_list_key, owner);

            if let Some(document_ids) = env
                .storage()
                .persistent()
                .get::<_, Vec<u32>>(&owner_docs_key)
            {
                let mut new_document_ids = vec![&env];
                for i in 0..document_ids.len() {
                    if let Some(id) = document_ids.get(i) {
                        if id != document_id {
                            new_document_ids.push_back(id);
                        }
                    }
                }
                env.storage()
                    .persistent()
                    .set(&owner_docs_key, &new_document_ids);
            }
            true
        } else {
            false
        }
    }

    /// Get documents by tags (filter documents that contain any of the specified tags)
    pub fn get_documents_by_tags(
        env: Env,
        owner: Address,
        search_tags: Vec<String>,
    ) -> Vec<EncryptedDocument> {
        let all_documents = Self::get_user_documents(env.clone(), owner);

        // Filter documents that have at least one matching tag
        let mut filtered_documents = vec![&env];
        for i in 0..all_documents.len() {
            if let Some(document) = all_documents.get(i) {
                // Check if document has any of the search tags
                let mut has_match = false;
                for j in 0..search_tags.len() {
                    if let Some(search_tag) = search_tags.get(j) {
                        for k in 0..document.tags.len() {
                            if let Some(doc_tag) = document.tags.get(k) {
                                if doc_tag == search_tag {
                                    has_match = true;
                                    break;
                                }
                            }
                        }
                        if has_match {
                            break;
                        }
                    }
                }
                if has_match {
                    filtered_documents.push_back(document);
                }
            }
        }

        filtered_documents
    }

    /// Get document count for a user
    pub fn get_document_count(env: Env, owner: Address) -> u32 {
        let docs_list_key = symbol_short!("docs");
        let owner_docs_key = (docs_list_key, owner);

        let document_ids: Vec<u32> = env
            .storage()
            .persistent()
            .get(&owner_docs_key)
            .unwrap_or_else(|| vec![&env]);

        document_ids.len() as u32
    }
}
