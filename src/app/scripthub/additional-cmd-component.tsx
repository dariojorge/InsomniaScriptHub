import React, { useEffect, useRef, useState } from 'react';
import { firstElement, getSettings, isEmpty, isListEmpty, readFileEnvs } from '../utils/Utils';
import CheckboxComponent from '../fragments/checkbox/checkbox';

const emptyCardData: CardData = { id: -1, title: '', selectedOption: '', options: [], filePath: '' };
const emptyListCardData: CardData[] = [emptyCardData];
const settingsFilename: string = 'settings.json';
const scriptHubPath = getSettings(settingsFilename).scriptHubPath;

const AdditionalCmdComponent = (props: { operation: CardData; selectedProject: string; updateData: any; }) => {
  const [cards, setCards] = useState<CardData[]>(emptyListCardData);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setCards(prev => prev.filter(operation => operation.id !== -1));
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (cards.length >= 5) {
      return;
    }

    let newElem: CardData;
    if (isListEmpty(props.operation.options) || cards.filter(card => card.title === "additionalCmd").length === 1) {
      return;
    }

    const operationOptionElem = firstElement(props.operation.options);
    if (!isListEmpty(operationOptionElem.cmdList)) {
      newElem = buildCardOfEnvType(operationOptionElem.cmdList);
    } else {
      newElem = emptyCardData;
    }

    if (newElem.id === -1) {
      return;
    }

    setCards(prev => [
      ...prev,
      newElem
    ]);
  }, [cards, props.selectedProject]);

  const buildCardOfEnvType = (cmdList: any): CardData => {
    const cmd: { name: any; type: any; } = firstElement(cmdList.filter((cmd: { name: any; type: any; }) => cmd.name === "additionalCmd"));
    const id = cards.length;
    const title = cmd.name;
    const selectedOption = cmd.type;
    const options: Data[] = listOfAllAdditionalCmd();
    const filePath = "";

    if(isListEmpty(options)) {
      return emptyCardData;
    }

    return { id: id, title: title, selectedOption: selectedOption, options: options, filePath: filePath };
  };

  const handleSelectChange = (data: any) => {
    props.updateData({ id: 0, title: data.name, selectedOption: data.value, options: [], filePath: "" });
  };

  const listOfAllAdditionalCmd = (): Data[] => {
    if (isEmpty(props.selectedProject)) {
      return [];
    }
    
    const settings = readFileEnvs(`${scriptHubPath}/projects/${props.selectedProject}`);
    const envList: Data[] = [];
    
    settings.additionalCmd?.filter(arg => arg.type === "arg").forEach(env => {
      envList.push({
        type: env.value,
        name: env.value
      });
    });
    return envList;
  }

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {!isListEmpty(cards) && firstElement(cards) !== null && !isListEmpty(firstElement(cards).options) && firstElement(cards).options.map((cmd: { name: string; }) => (
        <CheckboxComponent key={cmd.name} title={cmd.name} updateData={handleSelectChange}/>
      ))}
    </div>
  );
};

export default AdditionalCmdComponent;