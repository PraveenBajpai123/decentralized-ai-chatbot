"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GetDocumentCountProps {
    client: Client;
    publicKey: string;
}

const GetDocumentCount = ({
    client,
    publicKey
}: GetDocumentCountProps) => {
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGetCount = async () => {
        setLoading(true);
        try {
            const tx = await client.get_document_count({
                owner: publicKey,
            }, { simulate: true });

            if (tx.result !== undefined) {
                setCount(tx.result);
            } else {
                const result = await tx.signAndSend();
                if (result.result !== undefined) {
                    setCount(result.result);
                } else {
                    setCount(0);
                }
            }
        } catch (error: any) {
            alert(`Error fetching document count: ${error.message || 'Unknown error'}`);
            setCount(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Document Count</CardTitle>
                <CardDescription className="text-gray-400">
                    Get the total number of gist documents you own.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    onClick={handleGetCount}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                    {loading ? "Loading..." : "Get Document Count"}
                </Button>

                {count !== null && (
                    <div className="text-center py-4">
                        <div className="text-4xl font-bold text-green-400 mb-2">{count}</div>
                        <p className="text-gray-400">Total Documents</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default GetDocumentCount;

