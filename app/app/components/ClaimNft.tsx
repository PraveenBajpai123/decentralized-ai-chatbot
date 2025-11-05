"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ClaimNftProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const ClaimNft = ({
    client,
    publicKey,
    onTransaction
}: ClaimNftProps) => {
    const [recipient, setRecipient] = useState(publicKey);
    const [nft1ImageUri, setNft1ImageUri] = useState("");
    const [nft2ImageUri, setNft2ImageUri] = useState("");

    const handleClaimNft = async () => {
        if (!recipient || !nft1ImageUri || !nft2ImageUri) {
            alert("All fields are required!");
            return;
        }

        const promise = client.claim_nft({
            recipient,
            nft1_image_uri: nft1ImageUri,
            nft2_image_uri: nft2ImageUri,
        }).then(tx => tx.signAndSend());

        onTransaction(promise, "NFTs claimed successfully!");

        // Reset form
        setNft1ImageUri("");
        setNft2ImageUri("");
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Claim NFTs</CardTitle>
                <CardDescription className="text-gray-400">
                    Claim both NFTs for the winner by storing their image URIs. Both NFTs will be "minted" to the recipient's address.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-white">Recipient Address</Label>
                    <Input
                        id="recipient"
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="G..."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nft1ImageUri" className="text-white">NFT 1 Image URI</Label>
                    <Input
                        id="nft1ImageUri"
                        type="text"
                        value={nft1ImageUri}
                        onChange={(e) => setNft1ImageUri(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="https://example.com/nft1.jpg"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nft2ImageUri" className="text-white">NFT 2 Image URI</Label>
                    <Input
                        id="nft2ImageUri"
                        type="text"
                        value={nft2ImageUri}
                        onChange={(e) => setNft2ImageUri(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="https://example.com/nft2.jpg"
                    />
                </div>
                <Button
                    onClick={handleClaimNft}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    Claim NFTs
                </Button>
            </CardContent>
        </Card>
    );
};

export default ClaimNft;

