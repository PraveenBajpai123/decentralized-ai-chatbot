"use client";

import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface InitContractProps {
    client: Client;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const InitContract = ({
    client,
    onTransaction
}: InitContractProps) => {
    const handleInit = async () => {
        const promise = client.init().then(tx => tx.signAndSend());
        onTransaction(promise, "gists contract initialized successfully!");
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Initialize Contract</CardTitle>
                <CardDescription className="text-gray-400">
                    Initialize the gists contract on-chain. This sets up the storage for gist documents.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={handleInit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                    Initialize Contract
                </Button>
            </CardContent>
        </Card>
    );
};

export default InitContract;

