import { pick } from "lodash";
import styled from "styled-components";
import shallow from "zustand/shallow";
import resourceIconMap from "../../config/resources";
import Icon from "../../shared/components/icon";
import { ResourceType } from "../../shared/types";
import { enumFromKey, formatNumber } from "../../shared/utils";
import useStore from "../../store";

export function Resources() {
  const stats = useStore(s => pick(s.stats, [
    'resources', 'resourcesPerSec',
  ]), shallow);
  const discoveredResources = useStore(s => s.discovery.discoveredResources);

  return <ResourcesList>
    {Object.keys(stats.resources)
      .map(res => enumFromKey(ResourceType, res))
      .filter(resource => resource && discoveredResources[resource])
      .map(resource =>
        <Resource data-tip={resource} key={resource}>
          <Icon size="md" icon={resourceIconMap[resource!]} />
          <Amounts>
            <Total>{formatNumber(stats.resources[resource!], 0, 0)}</Total>
            <div className='per-sec'>{formatNumber(stats.resourcesPerSec[resource!], 0, 1)}/s</div>
          </Amounts>
        </Resource>
      )}
  </ResourcesList>;
}

const ResourcesList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  grid-gap: 30px;
  color: white;
  margin-bottom: 20px;
`;

const Resource = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 100px;
`;

const Amounts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 5px;
`;

const Total = styled.div`
  font-size: 20px;
  font-weight: bold;
`;