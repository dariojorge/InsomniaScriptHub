import React, { useEffect, useRef, useState } from 'react';
import { firstElement, getElementByType, getFolders, getLastElement, getSettings, isListEmpty, readFileEnvs, removeAllElems } from '../utils/Utils';

const emptyCardData: CardData = { id: -1, title: '', selectedOption: '', options: [], filePath: '' };
const emptyListCardData: CardData[] = [emptyCardData];
const settingsFilename: string = 'settings.json';
const scriptHubPath = getSettings(settingsFilename).scriptHubPath;

const OperationComponent = (props: { operation: CardData; operationData: CardData[]; updateData: any; }) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    props.updateData((prev: any[]) => prev.filter(operation => operation.id !== -1));
  }, [])

  useEffect(() => {
    props.updateData([]);
  }, [props.operation])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isListEmpty(props.operation.options)) {
      return;
    }

    const operationOptionElem = firstElement(props.operation.options);
    if (isListEmpty(operationOptionElem.cmdList)) {
      return;
    }

    console.log("operationOptionElem");
    console.log(operationOptionElem);

    const newElem = buildCardOfEnvType(operationOptionElem.cmdList);
    if (newElem.id === -1) {
      return;
    }

    props.updateData((prev: any) => [
      ...prev,
      newElem
    ]);
  }, [props.operationData]);

  const buildCardOfEnvType = (cmdList: any): CardData => {
    const count = isListEmpty(getLastElement(props.operationData)) ? 0 : getLastElement(props.operationData).id + 1;
    if (count > cmdList.length) {
      return emptyCardData;
    }

    const cmd: { name: any; type: any; } = cmdList[count];
    if (cmd === undefined || cmd.type === "additionalCmd" || cmd.type === "boolean") {
      return emptyCardData;
    }
    const id = props.operationData.length;
    const title = cmd.name;
    const selectedOption = cmd.type;
    const options: Data[] = getOptionsByType(cmd.type);
    const filePath = "";

    return { id: id, title: title, selectedOption: selectedOption, options: options, filePath: filePath };
  };

  const handleSelectChange = (id: number, value: string) => {
    props.updateData(removeAllElems(id, props.operationData));
    props.updateData((prev: any[]) =>
      prev.map(card => {
        let currentOption = getElementByType(card.options, value);
        return card.id === id ?
          {
            ...card,
            selectedOption: getType(currentOption, value)
          } : card;
      }
      )
    );
  };

  const getType = (currentOption: any, value: string) => {
    if (currentOption.type) {
      return currentOption.type;
    }

    return currentOption.types.filter((type: string) => type === value);
  }

  const getOptionsByType = (type: string) => {
    switch (type) {
      case "projectList":
        return listOfAllProjects();
      case "envs":
        return listOfAllEnvironments();
      case "boolean":
        return listOfAllEnvironments();
      default:
        return [];
    }

  }

  const getSelectedProject = () => {
    return firstElement(props.operationData.filter(cardData => cardData.title === "projects")).selectedOption;
  }

  const listOfAllProjects = (): Data[] => {
    const folderList = getFolders(`${scriptHubPath}/projects`);
    const folders: Data[] = [];
    folderList?.forEach(element => {
      folders.push({
        type: element,
        name: element
      });
    });
    return folders;
  }

  const listOfAllEnvironments = (): Data[] => {
    const selectedProject = getSelectedProject();
    const settings = readFileEnvs(`${scriptHubPath}/projects/${selectedProject}`);
    const envList: Data[] = [];
    settings.envs?.forEach(env => {
      envList.push({
        type: env.type,
        name: env.type
      });
    });
    return envList;
  }

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {props.operationData.map(card => (
        <div
          key={card.id}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '8px',
            width: '200px'
          }}
        >
          <h3>{card.title}</h3>
          <select
            value={card.selectedOption}
            onChange={e => handleSelectChange(card.id, e.target.value)}
          >
            <option value="">Select an option</option>
            {card.options.map(opt => (
              <option key={opt.name} value={opt.type}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default OperationComponent;