"use client";

import { useState } from "react";
import { Client, EncryptedDocument, Option } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GetDocumentProps {
    client: Client;
    publicKey: string;
}

const GetDocument = ({
    client,
    publicKey
}: GetDocumentProps) => {
    const [documentId, setDocumentId] = useState("");
    const [document, setDocument] = useState<EncryptedDocument | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGetDocument = async () => {
        if (!documentId) {
            alert("Please enter a Document ID!");
            return;
        }

        const documentIdNum = parseInt(documentId);
        if (isNaN(documentIdNum)) {
            alert("Document ID must be a valid number!");
            return;
        }

        setLoading(true);
        try {
            const tx = await client.get_document({
                owner: publicKey,
                document_id: documentIdNum,
            }, { simulate: true });

            if (tx.result) {
                const doc = tx.result as Option<EncryptedDocument>;
                if (doc !== null) {
                    setDocument(doc);
                } else {
                    setDocument(null);
                    alert("Document not found!");
                }
            } else {
                const result = await tx.signAndSend();
                if (result.result) {
                    const doc = result.result as Option<EncryptedDocument>;
                    if (doc !== null) {
                        setDocument(doc);
                    } else {
                        setDocument(null);
                        alert("Document not found!");
                    }
                } else {
                    setDocument(null);
                    alert("Document not found!");
                }
            }
        } catch (error: any) {
            alert(`Error fetching document: ${error.message || 'Unknown error'}`);
            setDocument(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Get Document</CardTitle>
                <CardDescription className="text-gray-400">
                    Retrieve a specific gist document by ID.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="documentId" className="text-white">Document ID</Label>
                    <div className="flex gap-2">
                        <Input
                            id="documentId"
                            type="number"
                            value={documentId}
                            onChange={(e) => setDocumentId(e.target.value)}
                            className="bg-gray-700 text-white border-gray-600"
                            placeholder="1"
                        />
                        <Button
                            onClick={handleGetDocument}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {loading ? "Loading..." : "Fetch Document"}
                        </Button>
                    </div>
                </div>

                {document && (
                    <div className="space-y-3 mt-4 bg-gray-700 border border-gray-600 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-white font-semibold text-lg">{document.name}</h4>
                                <p className="text-gray-300 text-sm mt-1">ID: {document.id}</p>
                            </div>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                Active
                            </span>
                        </div>
                        <div className="space-y-2 mt-4">
                            <div>
                                <span className="text-gray-400 text-sm">Owner:</span>
                                <p className="text-white text-sm break-all">{document.owner}</p>
                            </div>
                            <div>
                                <span className="text-gray-400 text-sm">Created:</span>
                                <p className="text-white text-sm">{new Date(Number(document.created_at) * 1000).toLocaleString()}</p>
                            </div>
                            <div>
                                <span className="text-gray-400 text-sm">Updated:</span>
                                <p className="text-white text-sm">{new Date(Number(document.updated_at) * 1000).toLocaleString()}</p>
                            </div>
                            {document.tags && document.tags.length > 0 && (
                                <div>
                                    <span className="text-gray-400 text-sm">Tags:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {document.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-400 text-sm">Encrypted Content Size:</span>
                                <p className="text-white text-sm">{document.encrypted_content.length} bytes</p>
                            </div>
                            {document.encrypted_metadata && (
                                <div>
                                    <span className="text-gray-400 text-sm">Encrypted Metadata Size:</span>
                                    <p className="text-white text-sm">{document.encrypted_metadata.length} bytes</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {document === null && !loading && documentId && (
                    <div className="text-gray-400 text-center py-4">
                        Document not found.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default GetDocument;

