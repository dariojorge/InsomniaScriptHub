import React, { useEffect, useRef, useState } from 'react';
import { checkForLastSlashInString, firstElement, getElementByType, getFolders, getLastElement, getSettings, isEmpty, isListEmpty, readFileDataList, readFileEnvs, removeAllElems } from '../utils/Utils';

const emptyCardData: CardData = { id: -1, title: '', selectedOption: '', options: [], filePath: '' };
const emptyListCardData: CardData[] = [emptyCardData];
const settingsFilename: string = 'settings.json';
const scriptHubPath = getSettings(settingsFilename).scriptHubPath;

const CardComponent = () => {
  const [cards, setCards] = useState<CardData[]>(emptyListCardData);
  const [cmdListCount, setCmdListCount] = useState<number>(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const settings = readFileDataList(scriptHubPath, settingsFilename);
    const options = settings.types;
    const scriptTypeInit = firstElement(options);
    setCards([{ id: 0, title: settings.type, selectedOption: scriptTypeInit.type, options: options, filePath: scriptHubPath }]);
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const lastElem = getLastElement(cards, cmdListCount);
    let newElem: CardData;
    if (isListEmpty(lastElem.options)) {
      return;
    }

    const firstOptionElem = firstElement(lastElem.options);
    if (!isListEmpty(firstOptionElem.cmdList)) {
      newElem = buildCardOfEnvType(firstOptionElem.cmdList, lastElem.selectedOption);
    } else {
      newElem = buildCardWithBasePath(lastElem, firstOptionElem);
    }

    if (newElem.id === -1) {
      return;
    }

    setCards(prev => [
      ...prev,
      newElem
    ]);
  }, [cards]);

  const buildCardOfEnvType = (cmdList: any, lastElemSelectedOption: string): CardData => {
    if (cmdListCount + 1 > cmdList.length) {
      return emptyCardData;
    }

    setCmdListCount(cmdListCount + 1);
    const cmd: { name: any; type: any; } = cmdList[cmdListCount];
    const id = cards.length;
    const title = cmd.name;
    const selectedOption = cmd.type;
    const options: Data[] = getOptionsByType(cmd.type);
    const filePath = "";

    return { id: id, title: title, selectedOption: selectedOption, options: options, filePath: filePath };
  };

  const buildCardWithBasePath = (lastElem: CardData, firstOptionElem: any): CardData => {
    if (lastElem.selectedOption) {
      firstOptionElem = getElementByType(lastElem.options, lastElem.selectedOption);
    }

    const id = cards.length;
    const basePath = firstOptionElem.basePath.replaceAll(".", "");
    const basePathFiltered = checkForLastSlashInString(basePath.split(''));
    const filePath = `${lastElem.filePath}${basePathFiltered}`;
    const settings = readFileDataList(filePath, settingsFilename);
    let options = settings.types;
    const nextElem = firstElement(options);

    if (isEmpty(nextElem)) {
      return emptyCardData;
    }

    const title = settings.type;
    let selectedOption = nextElem.type;

    if(title==="operation") {
      selectedOption = lastElem.selectedOption;

      const rawOptions = firstElement(options.filter(option => option.types?.includes(selectedOption)));
      const types = rawOptions.types;
      const cmdList = rawOptions.cmdList;
      options = [];
      types?.forEach((type: string) => {
        options.push({
          type: type,
          name: type,
          cmdList: cmdList
        });
      });
    }

    return { id: id, title: title, selectedOption: selectedOption, options: options, filePath: filePath };
  };

  const handleSelectChange = (id: number, value: string) => {
    cmdListCountRemoval(id);
    setCards(removeAllElems(id, cards));
    setCards(prev =>
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

  const cmdListCountRemoval = (id: number) => {
    const calc = cmdListCount - (cards.length - (id + 1));
    if (calc < 0) {
      setCmdListCount(0);
      return;
    }

    setCmdListCount(calc);
  }

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
      case "additionalCmd":
        return listOfAllAdditionalCmd();
      default:
        return [{ type: "a", name: "b" }];
    }

  }

  const getSelectedProject = () => {
    return firstElement(cards.filter(cardData => cardData.title === "projects")).selectedOption;
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

  const listOfAllAdditionalCmd = (): Data[] => {
    const selectedProject = getSelectedProject();
    const settings = readFileEnvs(`${scriptHubPath}/projects/${selectedProject}`);
    const envList: Data[] = [];
    settings.additionalCmd?.forEach(env => {
      envList.push({
        type: env.key,
        name: env.key
      });
    });
    return envList;
  }

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {cards.filter(card => card.title !== "operation").map(card => (
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

export default CardComponent;