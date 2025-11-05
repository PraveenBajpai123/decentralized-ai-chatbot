"use client";

import { useState } from "react";
import { Client, EncryptedDocument } from "@/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GetUserDocumentsProps {
    client: Client;
    publicKey: string;
}

const GetUserDocuments = ({
    client,
    publicKey
}: GetUserDocumentsProps) => {
    const [documents, setDocuments] = useState<EncryptedDocument[]>([]);
    const [loading, setLoading] = useState(false);

    const handleGetDocuments = async () => {
        setLoading(true);
        try {
            const tx = await client.get_user_documents({
                owner: publicKey,
            }, { simulate: true });

            if (tx.result) {
                setDocuments(tx.result);
            } else {
                const result = await tx.signAndSend();
                if (result.result) {
                    setDocuments(result.result);
                } else {
                    setDocuments([]);
                }
            }
        } catch (error: any) {
            alert(`Error fetching documents: ${error.message || 'Unknown error'}`);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">My gist Documents</CardTitle>
                <CardDescription className="text-gray-400">
                    Retrieve all your gist documents.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    onClick={handleGetDocuments}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                    {loading ? "Loading..." : "Fetch All Documents"}
                </Button>

                {documents.length > 0 && (
                    <div className="space-y-3 mt-4">
                        <h3 className="text-lg font-semibold text-white">Documents ({documents.length})</h3>
                        {documents.map((doc, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 border border-gray-600 rounded-lg p-4 space-y-2"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-white font-semibold text-lg">{doc.name}</h4>
                                        <p className="text-gray-300 text-sm mt-1">ID: {doc.id}</p>
                                    </div>
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                        Active
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-400">Created:</span>
                                        <p className="text-white">{new Date(Number(doc.created_at) * 1000).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Updated:</span>
                                        <p className="text-white">{new Date(Number(doc.updated_at) * 1000).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {doc.tags && doc.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {doc.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {documents.length === 0 && !loading && (
                    <div className="text-gray-400 text-center py-4">
                        No documents found. Click the button above to fetch your documents.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default GetUserDocuments;

