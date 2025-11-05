"use client";

import { useState } from "react";
import { Client, EncryptedDocument } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GetDocumentsByTagsProps {
    client: Client;
    publicKey: string;
}

const GetDocumentsByTags = ({
    client,
    publicKey
}: GetDocumentsByTagsProps) => {
    const [searchTags, setSearchTags] = useState("");
    const [documents, setDocuments] = useState<EncryptedDocument[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearchByTags = async () => {
        if (!searchTags.trim()) {
            alert("Please enter at least one tag!");
            return;
        }

        const tagsArray = searchTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        if (tagsArray.length === 0) {
            alert("Please enter valid tags!");
            return;
        }

        setLoading(true);
        try {
            const tx = await client.get_documents_by_tags({
                owner: publicKey,
                search_tags: tagsArray,
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
            alert(`Error searching documents: ${error.message || 'Unknown error'}`);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Search by Tags</CardTitle>
                <CardDescription className="text-gray-400">
                    Find documents that contain any of the specified tags.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="searchTags" className="text-white">Search Tags</Label>
                    <div className="flex gap-2">
                        <Input
                            id="searchTags"
                            type="text"
                            value={searchTags}
                            onChange={(e) => setSearchTags(e.target.value)}
                            className="bg-gray-700 text-white border-gray-600"
                            placeholder="e.g., reforestation, renewable-energy, verified"
                        />
                        <Button
                            onClick={handleSearchByTags}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </div>
                    <p className="text-xs text-gray-400">Separate multiple tags with commas</p>
                </div>

                {documents.length > 0 && (
                    <div className="space-y-3 mt-4">
                        <h3 className="text-lg font-semibold text-white">Found Documents ({documents.length})</h3>
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

                {documents.length === 0 && !loading && searchTags && (
                    <div className="text-gray-400 text-center py-4">
                        No documents found matching these tags.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default GetDocumentsByTags;

