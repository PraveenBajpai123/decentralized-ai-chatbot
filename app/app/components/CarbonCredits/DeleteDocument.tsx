"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DeleteDocumentProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const DeleteDocument = ({
    client,
    publicKey,
    onTransaction
}: DeleteDocumentProps) => {
    const [documentId, setDocumentId] = useState("");

    const handleDeleteDocument = async () => {
        if (!documentId) {
            alert("Document ID is required!");
            return;
        }

        const documentIdNum = parseInt(documentId);
        if (isNaN(documentIdNum)) {
            alert("Document ID must be a valid number!");
            return;
        }

        if (!confirm(`Are you sure you want to delete document ${documentId}? This action cannot be undone.`)) {
            return;
        }

        const promise = client.delete_document({
            owner: publicKey,
            document_id: documentIdNum,
        }).then(tx => tx.signAndSend());

        onTransaction(promise, "Document deleted successfully!");

        // Reset form
        setDocumentId("");
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Delete Document</CardTitle>
                <CardDescription className="text-gray-400">
                    Permanently delete a gist document by ID.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="documentId" className="text-white">Document ID</Label>
                    <Input
                        id="documentId"
                        type="number"
                        value={documentId}
                        onChange={(e) => setDocumentId(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="1"
                    />
                </div>
                <Button
                    onClick={handleDeleteDocument}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                    Delete Document
                </Button>
            </CardContent>
        </Card>
    );
};

export default DeleteDocument;

