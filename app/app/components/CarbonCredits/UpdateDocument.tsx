"use client";

import { useState } from "react";
import { Client, Option } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UpdateDocumentProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const UpdateDocument = ({
    client,
    publicKey,
    onTransaction
}: UpdateDocumentProps) => {
    const [documentId, setDocumentId] = useState("");
    const [name, setName] = useState("");
    const [encryptedContent, setEncryptedContent] = useState("");
    const [encryptedMetadata, setEncryptedMetadata] = useState("");
    const [tags, setTags] = useState("");

    const handleUpdateDocument = async () => {
        if (!documentId) {
            alert("Document ID is required!");
            return;
        }

        const documentIdNum = parseInt(documentId);
        if (isNaN(documentIdNum)) {
            alert("Document ID must be a valid number!");
            return;
        }

        // Prepare optional fields
        const nameOption: Option<string> = name.trim() ? name : null;
        const contentOption: Option<Buffer> = encryptedContent.trim()
            ? Buffer.from(encryptedContent, 'utf-8')
            : null;
        const metadataOption: Option<Buffer> = encryptedMetadata.trim()
            ? Buffer.from(encryptedMetadata, 'utf-8')
            : null;
        const tagsOption: Option<Array<string>> = tags.trim()
            ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
            : null;

        const promise = client.update_document({
            owner: publicKey,
            document_id: documentIdNum,
            encrypted_content: contentOption,
            name: nameOption,
            encrypted_metadata: metadataOption,
            tags: tagsOption,
        }).then(tx => tx.signAndSend());

        onTransaction(promise, "Document updated successfully!");

        // Reset form
        setDocumentId("");
        setName("");
        setEncryptedContent("");
        setEncryptedMetadata("");
        setTags("");
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Update Document</CardTitle>
                <CardDescription className="text-gray-400">
                    Update an existing gist document. Leave fields empty to keep current values.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="documentId" className="text-white">Document ID *</Label>
                    <Input
                        id="documentId"
                        type="number"
                        value={documentId}
                        onChange={(e) => setDocumentId(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="1"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Document Name (Optional)</Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="Leave empty to keep current name"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="encryptedContent" className="text-white">Encrypted Content (Optional)</Label>
                    <Textarea
                        id="encryptedContent"
                        value={encryptedContent}
                        onChange={(e) => setEncryptedContent(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600 min-h-[100px]"
                        placeholder="Leave empty to keep current content"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="encryptedMetadata" className="text-white">Encrypted Metadata (Optional)</Label>
                    <Textarea
                        id="encryptedMetadata"
                        value={encryptedMetadata}
                        onChange={(e) => setEncryptedMetadata(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600 min-h-[80px]"
                        placeholder="Leave empty to keep current metadata"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tags" className="text-white">Tags (Optional)</Label>
                    <Input
                        id="tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="e.g., reforestation, verified (comma-separated)"
                    />
                </div>
                <Button
                    onClick={handleUpdateDocument}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Update Document
                </Button>
            </CardContent>
        </Card>
    );
};

export default UpdateDocument;

