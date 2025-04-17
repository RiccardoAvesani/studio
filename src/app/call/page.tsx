"use client";

import React, {useState, useEffect, useCallback} from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {
    getMoodleFunctions,
    MoodleFunction,
    callMoodleApi,
    MoodleFunctionParameter
} from "@/services/moodle";
import {Textarea} from "@/components/ui/textarea";
import {Table, TableBody, TableCaption, TableCell, TableContent, TableFooter, TableHeader, TableHead, TableRow,} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {Icons} from "@/components/icons";
import {Badge} from "@/components/ui/badge";
import {useToast} from "@/hooks/use-toast";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import useConfig from "@/hooks/use-config";

interface LogEntry {
    id: string;
    timestampRequest: string;
    timestampResponse: string;
    functionName: string;
    parameters: Record<string, any>;
    request: any;
    response: any;
}

const CallPage: React.FC = () => {
    const [moodleFunctions, setMoodleFunctions] = useState<MoodleFunction[]>([]);
    const [selectedFunction, setSelectedFunction] = useState<MoodleFunction | null>(null);
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [lastRequest, setLastRequest] = useState<any>(null);
    const [lastResponse, setLastResponse] = useState<any>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;
    const {toast} = useToast();
    const {config} = useConfig();

    useEffect(() => {
        const fetchFunctions = async () => {
            const functions = await getMoodleFunctions(config);
            setMoodleFunctions(functions);
        };

        fetchFunctions();
    }, [config]);

    const handleFunctionSelect = (functionName: string) => {
        const selected = moodleFunctions.find((func) => func.name === functionName);
        setSelectedFunction(selected || null);
        setFormValues({}); // Reset form values when function changes
    };

    const handleInputChange = (name: string, value: any) => {
        setFormValues(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async () => {
        if (!selectedFunction) {
            alert("Please select a Moodle API function.");
            return;
        }

        const functionName = selectedFunction.name;

        const timestampRequest = new Date().toISOString();
        const request = {
            functionName: functionName,
            params: formValues,
            apiUrl: config.url,
            apiKey: config.apiKey,
        };

        setLastRequest(request);

        try {
            const response = await callMoodleApi(config, functionName, formValues);
            const timestampResponse = new Date().toISOString();
            setLastResponse(response);

            const logEntry: LogEntry = {
                id: Date.now().toString(),
                timestampRequest: timestampRequest,
                timestampResponse: timestampResponse,
                functionName: functionName,
                parameters: formValues,
                request: request,
                response: response,
            };

            setLogs(prevLogs => [logEntry, ...prevLogs]);
            toast({
                title: "API Call Executed",
                description: `Successfully called ${functionName}`,
            });
        } catch (error: any) {
            console.error("API call failed:", error);
            setLastResponse({error: error.message || 'API call failed'});
            toast({
                title: "API Call Failed",
                description: error.message || 'API call failed',
                variant: "destructive",
            });
        }
    };

    const handleViewLog = (log: LogEntry) => {
        setSelectedLog(log);
        setLastRequest(log.request);
        setLastResponse(log.response);
    };

    const handleTryAgain = (log: LogEntry) => {
        setSelectedFunction(moodleFunctions.find(func => func.name === log.functionName) || null);
        setFormValues(log.parameters);
        // Scroll to the top to show the form
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleDeleteLog = (logId: string) => {
        setLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
        if (selectedLog && selectedLog.id === logId) {
            setSelectedLog(null);
            setLastRequest(null);
            setLastResponse(null);
        }
    };

    const totalPages = Math.ceil(logs.length / itemsPerPage);
    const paginatedLogs = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const MoodleApiForm = useCallback(() => {
        if (!selectedFunction) return null;

        return (
            <div className="grid gap-4">
                {selectedFunction.parameters.map((param: MoodleFunctionParameter) => (
                    <div key={param.name} className="grid gap-2">
                        <Label htmlFor={param.name}>{param.name}
                            {param.required ? <Badge className="ml-2">Required</Badge> : null}
                        </Label>
                        {param.possibleValues ? (
                            <Select
                                defaultValue={formValues[param.name] || ""}
                                onValueChange={(value) => handleInputChange(param.name, value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={`Select ${param.name}`}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {param.possibleValues.map((value) => (
                                        <SelectItem key={value} value={value}>{value}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                type="text"
                                id={param.name}
                                placeholder={param.type}
                                defaultValue={formValues[param.name] || ""}
                                onChange={(e) => handleInputChange(param.name, e.target.value)}
                            />
                        )}
                    </div>
                ))}
                <Button onClick={handleSubmit}>Submit</Button>
            </div>
        );
    }, [selectedFunction, formValues, handleInputChange, handleSubmit, config]);

    return (
        <>
        <div className="container py-10">
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Call Moodle API</CardTitle>
                        <CardDescription>Select a Moodle API function to call.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <Label htmlFor="function">Select Function</Label>
                            <Select onValueChange={handleFunctionSelect}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a Moodle API function"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {moodleFunctions.map((func) => (
                                        <SelectItem key={func.name} value={func.name}>{func.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedFunction && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Function Details</h3>
                                <p>
                                    <Badge>Signature:</Badge> {selectedFunction.name}(
                                    {selectedFunction.parameters.map((param) => param.name).join(", ")}
                                    )
                                </p>
                                <p><Badge>Description:</Badge> {selectedFunction.description}</p>
                                <div className="mt-4">
                                    <h4 className="text-md font-semibold">Parameters</h4>
                                    {/* Moodle API Form */}
                                    <MoodleApiForm/>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* API Call History and Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Last Request</CardTitle>
                            <CardDescription>Details of the last API request.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                readOnly
                                value={lastRequest ? JSON.stringify(lastRequest, null, 2) : "No request yet."}
                                className="min-h-[100px]"/>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Last Response</CardTitle>
                            <CardDescription>Response from the last API call.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                readOnly
                                value={lastResponse ? JSON.stringify(lastResponse, null, 2) : "No response yet."}
                                className="min-h-[100px]"/>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>API Call History</CardTitle>
                        <CardDescription>History of API calls with options to view details or try
                            again.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableCaption>A list of your recent API calls.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Function</TableHead>
                                    <TableHead>Request Time</TableHead>
                                    <TableHead>Response Time</TableHead>
                                    <TableHead>Parameters</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{log.functionName}</TableCell>
                                        <TableCell>{new Date(log.timestampRequest).toLocaleString(config.language)}</TableCell>
                                        <TableCell>{new Date(log.timestampResponse).toLocaleString(config.language)}</TableCell>
                                        <TableCell>
                                            {Object.entries(log.parameters).map(([key, value]) => (
                                                <div key={key}>
                                                    {key}: {value}
                                                </div>
                                            ))}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            <Button variant="ghost" size="sm" onClick={() => handleViewLog(log)}>
                                                <Icons.list className="mr-2 h-4 w-4"/>
                                                View
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleTryAgain(log)}>
                                                <Icons.play className="mr-2 h-4 w-4"/>
                                                Try Again
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <Icons.delete className="mr-2 h-4 w-4"/>
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete this log from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteLog(log.id)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-between items-center mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        </>
    );
};

export default CallPage;


    