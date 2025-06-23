import React, { useEffect, useRef } from 'react';
import { checkForLastSlashInString, firstElement, getElementByType, getLastElement, getSettings, isEmpty, isListEmpty, readFileDataList, removeAllElems } from '../utils/Utils';

const emptyCardData: CardData = { id: -1, title: '', selectedOption: '', options: [], filePath: '' };
const emptyListCardData: CardData[] = [emptyCardData];
const settingsFilename: string = 'settings.json';
const scriptHubPath = getSettings(settingsFilename).scriptHubPath;

const ScriptComponent = (props: { scriptData: CardData[]; updateData: any; }) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    const settings = readFileDataList(scriptHubPath, settingsFilename);
    const options = settings.types;
    const scriptTypeInit = firstElement(options);
    const initData = [{ id: 0, title: settings.type, selectedOption: scriptTypeInit.type, options: options, filePath: scriptHubPath }];
    props.updateData(initData);
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const lastElem = getLastElement(props.scriptData);
    if (lastElem.title === "operation") {
      return;
    }

    const newElem = buildCardWithBasePath(lastElem);
    if (newElem.id === -1) {
      return;
    }

    props.updateData((prev: any) => [
      ...prev,
      newElem
    ]);
  }, [props.scriptData]);

  const buildCardWithBasePath = (lastElem: CardData): CardData => {
    if (!lastElem.selectedOption) {
      return emptyCardData;
    }

    const firstOptionElem = getElementByType(lastElem.options, lastElem.selectedOption);
    const id = props.scriptData.length;
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

    if (title === "operation") {
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
    props.updateData(removeAllElems(id, props.scriptData));
    props.updateData((prev: { options: any[]; id: number; }[]) =>
      prev.map((card: { options: any[]; id: number; }) => {
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

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {props.scriptData.filter(card => card.title !== "operation").map(card => (
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

export default ScriptComponent;