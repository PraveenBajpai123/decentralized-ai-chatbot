"use client";

import { useState } from "react";
import { Client, Option } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StoreDocumentProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const StoreDocument = ({
    client,
    publicKey,
    onTransaction
}: StoreDocumentProps) => {
    const [name, setName] = useState("");
    const [encryptedContent, setEncryptedContent] = useState("");
    const [encryptedMetadata, setEncryptedMetadata] = useState("");
    const [tags, setTags] = useState("");

    const handleStoreDocument = async () => {
        if (!name || !encryptedContent) {
            alert("Name and encrypted content are required!");
            return;
        }

        // Convert encrypted content to Buffer
        const contentBuffer = Buffer.from(encryptedContent, 'utf-8');

        // Convert encrypted metadata to Buffer if provided, otherwise None
        let metadataOption: Option<Buffer>;
        if (encryptedMetadata.trim()) {
            metadataOption = Buffer.from(encryptedMetadata, 'utf-8');
        } else {
            metadataOption = null;
        }

        // Parse tags (comma-separated)
        const tagsArray = tags.trim()
            ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
            : [];

        const promise = client.store_document({
            owner: publicKey,
            encrypted_content: contentBuffer,
            name,
            encrypted_metadata: metadataOption,
            tags: tagsArray,
        }).then(tx => tx.signAndSend());

        onTransaction(promise, "gist document stored successfully!");

        // Reset form
        setName("");
        setEncryptedContent("");
        setEncryptedMetadata("");
        setTags("");
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Store gist Document</CardTitle>
                <CardDescription className="text-gray-400">
                    Store a new encrypted gist document. Each document will be assigned a unique ID automatically.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Document Name *</Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="e.g., Carbon Offset Project 2024"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="encryptedContent" className="text-white">Encrypted Content *</Label>
                    <Textarea
                        id="encryptedContent"
                        value={encryptedContent}
                        onChange={(e) => setEncryptedContent(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600 min-h-[100px]"
                        placeholder="Enter encrypted document content (Base64 or hex encoded)"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="encryptedMetadata" className="text-white">Encrypted Metadata (Optional)</Label>
                    <Textarea
                        id="encryptedMetadata"
                        value={encryptedMetadata}
                        onChange={(e) => setEncryptedMetadata(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600 min-h-[80px]"
                        placeholder="Enter encrypted metadata (optional)"
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
                        placeholder="e.g., reforestation, renewable-energy, verified (comma-separated)"
                    />
                    <p className="text-xs text-gray-400">Separate multiple tags with commas</p>
                </div>
                <Button
                    onClick={handleStoreDocument}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                    Store Document
                </Button>
            </CardContent>
        </Card>
    );
};

export default StoreDocument;

