"use client";

import { useState, useEffect } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MyNftsProps {
    client: Client;
    publicKey: string;
}

const MyNfts = ({
    client,
    publicKey
}: MyNftsProps) => {
    const [ownerAddress, setOwnerAddress] = useState(publicKey);
    const [nfts, setNfts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNfts = async () => {
        if (!ownerAddress) {
            alert("Please enter an owner address!");
            return;
        }

        setIsLoading(true);
        try {
            const result = await client.get_nfts({ owner: ownerAddress });
            const nftList = result.result || [];
            setNfts(nftList);
        } catch (error: any) {
            console.error("Error fetching NFTs:", error);
            alert(error.message || "Failed to fetch NFTs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (publicKey) {
            setOwnerAddress(publicKey);
        }
    }, [publicKey]);

    useEffect(() => {
        if (ownerAddress && publicKey && ownerAddress === publicKey) {
            fetchNfts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ownerAddress, publicKey]);

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">My NFTs</CardTitle>
                <CardDescription className="text-gray-400">
                    View all NFTs owned by an address
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="ownerAddress" className="text-white">Owner Address</Label>
                    <div className="flex gap-2">
                        <Input
                            id="ownerAddress"
                            type="text"
                            value={ownerAddress}
                            onChange={(e) => setOwnerAddress(e.target.value)}
                            className="bg-gray-700 text-white border-gray-600"
                            placeholder="G..."
                        />
                        <Button
                            onClick={fetchNfts}
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isLoading ? "Loading..." : "Fetch"}
                        </Button>
                    </div>
                </div>

                {nfts.length > 0 ? (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">NFT Image URIs:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {nfts.map((uri, index) => (
                                <div key={index} className="bg-gray-700 rounded-lg p-4 space-y-2">
                                    <p className="text-sm text-gray-300 break-all">{uri}</p>
                                    {uri.startsWith("http") && (
                                        <img
                                            src={uri}
                                            alt={`NFT ${index + 1}`}
                                            className="w-full h-auto rounded-lg"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    !isLoading && (
                        <p className="text-gray-400 text-center py-4">No NFTs found for this address</p>
                    )
                )}
            </CardContent>
        </Card>
    );
};

export default MyNfts;

