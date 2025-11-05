Decentralized Gists Platform
## Project name:


CDVD7OQOQZ36RFWMYLP5ROXYHSLQHCMN75ARPGPJD5HC4QNQHJN6LSWK
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/06fbd6e3-9c78-4763-8814-ee125a6ffc2b" />



## Overview

**Decentralized Gists Platform** is a secure solution built on the Stellar Soroban smart contract platform that allows users to store, encrypt, search, and manage gists (code snippets and documents) with privacy and decentralized control. Users can create, view, and organize their encrypted gists on the blockchain.

---

## Features

- **Decentralized Gist Storage:** Store encrypted gists in a decentralized manner using Stellar Soroban smart contracts.
- **Fine-grained Access Control:** Only gist owners can add or manage their own gists.
- **Tag-based Organization:** Organize gists with tags for easy searching and filtering.
- **Metadata Support:** Store optional encrypted metadata alongside gists.
- **Privacy First:** All sensitive data is encrypted on the client side and only accessible by the owner.
- **Blockchain-based:** Leverages Stellar Soroban for secure, decentralized storage.

---

## Quick Start

1. **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/document-encrypting-platform.git
    cd document-encrypting-platform
    ```

2. **Install Dependencies**
    - Install Soroban CLI: https://docs.stellar.org/learn/smart-contracts/soroban/getting-started
    - Install Rust (for contract compilation)

3. **Build Smart Contract**
    ```bash
    cd contract
    cargo build --target wasm32-unknown-unknown --release
    ```

4. **Deploy to Soroban Testnet**
    - Use the Soroban CLI or your preferred deployment method.
    - Example:
    ```bash
    soroban contract deploy --wasm target/wasm32-unknown-unknown/release/document_storage.wasm --network testnet
    ```

5. **Frontend**
    - Navigate to the `app` folder and run the Next.js frontend application.
    - The frontend provides a user-friendly interface for managing gists on the blockchain.

---

## Smart Contract

The core logic is implemented in `contract/src/lib.rs` using Soroban SDK.

Main structure:

- `EncryptedDocument`: Contains ID, owner, encrypted content, tags, metadata, timestamps
- `DocumentStorage`: Contract to store and manage documents

Example usage:
- Store a gist: `store_document(owner, encrypted_content, name, encrypted_metadata, tags)`
- Retrieve a gist: `get_document(owner, document_id)`
- List gists for user: `get_user_documents(owner)`
- Search by tags: `get_documents_by_tags(owner, search_tags)`
- Get document count: `get_document_count(owner)`

---

## Security

- All gist contents and metadata are encrypted before being sent to the contract.
- Only gist owners can access or modify their own gists.
- The contract does **not** contain or use any private keys.
- All encryption happens client-side for maximum privacy.

---

## Usage

Interact with the platform via the web interface to:
- Store new gists with encrypted content
- View all your gists
- Retrieve specific gists by ID
- Search gists by tags
- View your total gist count

---

## Roadmap

- [x] Soroban smart contract for encrypted gists
- [x] Owner access control
- [x] Web-based frontend UI
- [x] Tag-based search and filtering
- [x] Gist management (store, view, search)

---

## License

MIT

---

## Contributing

1. Fork this repo
2. Create a feature branch
3. Submit a PR

---

*For more info, see [contract/src/lib.rs](contract/src/lib.rs) and the project wiki.*
