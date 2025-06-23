import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { firstElement, getLastElement, getSettings, isBlank, isEmpty, isListEmpty } from "../utils/Utils";
import ScriptComponent from "./script-component";
import OperationComponent from "./operation-component";
import AdditionalCmdComponent from "./additional-cmd-component";

const settingsFilename: string = 'settings.json';
const scriptHubPath = getSettings(settingsFilename).scriptHubPath;
const emptyCardData: CardData = { id: -1, title: '', selectedOption: '', options: [], filePath: '' };
const emptyListCardData: CardData[] = [emptyCardData];


const ScriptHub = (props: {}) => {
    const [scriptData, setScriptData] = useState<CardData[]>(emptyListCardData);
    const [operation, setOperation] = useState<CardData>(emptyCardData);
    const [operationData, setOperationData] = useState<CardData[]>(emptyListCardData);
    const [additionalCmdData, setAdditionalCmdData] = useState<CardData[]>(emptyListCardData);
    const [selectedProject, setSelectedProject] = useState<string>("");

    const [argumentData, setArgumentData] = useState<ArgumentModel[]>([]);

    useEffect(() => {
        //console.log("Argument Data:");
        //console.log(argumentData);
    }, [argumentData]);

    useEffect(() => {
        console.log("Script Data:");
        console.log(scriptData);

        buildArgumentData(scriptData.filter(script => script.title !== "operation"));
        buildOperation();
    }, [scriptData]);

    const buildOperation = () => {
        const opetationResult = firstElement(scriptData.filter(script => script.title === "operation"));
        if (opetationResult === null || opetationResult.id === -1) {
            return;
        }
        setOperation(opetationResult);
    }

    useEffect(() => {
        console.log("Operation Data:");
        console.log(operationData);
        buildArgumentData(operationData.filter(card => card.id !== 0));
        buildAdditionalCmdData();
        buildSelectedProject();
    }, [operationData]);

    const buildAdditionalCmdData = () => {
        const additionalCmd = operationData.filter(card => card.id !== 0);
        setAdditionalCmdData(additionalCmd);
    }

    const buildSelectedProject = () => {
        const projects = firstElement(operationData.filter(data => data.title === "projects"));
        if (projects !== null && !isEmpty(projects.selectedOption)) {
            setSelectedProject(projects.selectedOption);
        }
    }


    const handleOnClick = async () => {
        //console.log(scriptType);
    };

    const buildArgumentData = (cardData: CardData[]) => {
        const newData: ArgumentModel[] = cardData.map(data => ({ title: data.title, value: data.selectedOption }));
        const mergedUnique = Array.from(
            new Map([...argumentData.filter(argument => !isBlank(argument.title)), ...newData].map(item => [item.title, item])).values()
        );
        setArgumentData(mergedUnique);
    }

    return (
        <>
            <div>
                <button className="start-script" id="start-script-btn" onClick={handleOnClick}>
                    Start Script Hub
                </button>
            </div>
            <div>
                <ScriptComponent scriptData={scriptData} updateData={setScriptData} />
            </div>
            {operation.id !== -1 &&
                <div>
                    <OperationComponent operation={operation} operationData={operationData} updateData={setOperationData} />
                </div>
            }
            {!isListEmpty(additionalCmdData) && firstElement(additionalCmdData).id !== -1 &&
                <div>
                    <AdditionalCmdComponent additionalCmd={operation} selectedProject={selectedProject} updateData={setAdditionalCmdData} />
                </div>
            }

        </>
    );
}

const RenderPanelScriptHub = (elemCustom: any) => {
    const elementRoot = createRoot(elemCustom);
    elementRoot.render((<ScriptHub />))
};

export default RenderPanelScriptHub;