import { pick } from "lodash";
import { useCallback, useState } from "react";
import styled from "styled-components";
import shallow from "zustand/shallow";
import {useFloating, useHover, useInteractions, safePolygon} from '@floating-ui/react';

import Icon from "../../shared/components/icon";
import { ResourceType } from "../../shared/types";
import { autoFormatNumber, enumFromKey } from "../../shared/utils";
import useStore from "../../store";
import resourcesConfig from "../../config/resources";

export function Resources() {
  const stats = useStore(s => pick(s.stats, [
    'resources', 'resourcesPerSec', 'sellResourcePrice', 'sellResource'
  ]), shallow);
  const discoveredResources = useStore(s => s.discovery.discoveredResources);

  const onSell = useCallback((resource: ResourceType, percent: number) => {
    stats.sellResource(resource, percent);
  }, [stats.sellResource]);

  return <ResourcesList>
    {Object.keys(stats.resources)
      .map(res => enumFromKey(ResourceType, res)!)
      .filter(resource => resource && discoveredResources[resource])
      .map(resource =>
        <Resource
          key={resource}
          resource={resource}
          amount={stats.resources[resource]}
          perSec={stats.resourcesPerSec[resource]}
          sellPrice={stats.sellResourcePrice[resource]}
          onSell={onSell}
        />
      )}
  </ResourcesList>;
}

interface ResourceProps {
  resource: ResourceType;
  amount: number;
  perSec: number;
  sellPrice: number;
  onSell: (resource: ResourceType, percent: number) => void,
}
function Resource(props: ResourceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {refs, floatingStyles, context} = useFloating({
    placement: "bottom",
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const hover = useHover(context, {
    handleClose: safePolygon(),
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([hover]);
      //ref={refs.setReference}
      //{...getReferenceProps()}

  return <>
    <StyledResource
    >
      <Icon size="md" icon={resourcesConfig[props.resource].icon} />
      <Amounts>
        <Total>{autoFormatNumber(props.amount)}</Total>
        <div className='per-sec'>{autoFormatNumber(props.perSec)}/s</div>
      </Amounts>
    </StyledResource>

    {(isOpen && props.resource !== ResourceType.Gold && props.sellPrice > 0) &&
      <Tooltip ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
        <TooltipTitle>Sell for {props.sellPrice}<Icon size="xs" icon={resourcesConfig[ResourceType.Gold].icon} /> each</TooltipTitle>
        
        <SellButtons>
          <button onClick={() => props.onSell(props.resource, 0.1)}>10%</button>
          <button onClick={() => props.onSell(props.resource, 0.5)}>Half</button>
          <button onClick={() => props.onSell(props.resource, 1)}>All</button>
        </SellButtons>
      </Tooltip>
    }
  </>;
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

const StyledResource = styled.div`
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

const Tooltip = styled.div`
  background-color: #222;
  border-radius: 5px;
  padding: 10px;
  color: white;
  z-index: 10;
`;

const TooltipTitle = styled.strong`
  display: flex;
  margin-bottom: 8px;

  .icon {
    margin-left: 1px;
    margin-right: 5px;
  }
`;

const SellButtons = styled.div`
  display: flex;
  gap: 3px;
`;