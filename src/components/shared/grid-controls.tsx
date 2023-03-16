import { pick } from "lodash";
import { useCallback } from "react";
import styled from "styled-components";
import shallow from "zustand/shallow";
import useStore from "../../store";

export function GridControls(props: {gridId: string}) {
  const cardGrids = useStore(s => pick(s.cardGrids, [
    'clearGrid',
  ]), shallow);

  const onClearGrid = useCallback(() => {
    cardGrids.clearGrid(props.gridId);
  }, [cardGrids.clearGrid, props.gridId]);

  return <Container>
    <button
      className='secondary-button'
      data-tip="Returns all cards to your inventory."
      onClick={onClearGrid}
    >Clear Grid</button>
  </Container>;
}

const Container = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 10px;
`;