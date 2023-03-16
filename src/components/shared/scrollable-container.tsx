import { ReactNode, useCallback, useState } from "react";
import styled from "styled-components";

interface Coords {
  x: number;
  y: number;
}

export function ScrollableContainer(props: {children: ReactNode}) {
  const [panOffset, setPanOffset] = useState<Coords>({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);

  const moveMouse = useCallback((evt: React.MouseEvent<Element, MouseEvent>) => {
    if (isDragging) {
      setPanOffset({ x: evt.movementX + panOffset.x, y: evt.movementY + panOffset.y });
    }
  }, [isDragging, panOffset, setPanOffset]);

  return <Container
    onMouseDown={() => setIsDragging(true)}
    onMouseUp={() => setIsDragging(false)}
    onMouseMove={(evt) => moveMouse(evt)}
  >
    <InnerContainer style={{top: panOffset.y, left: panOffset.x}}>
      {props.children}
    </InnerContainer>
  </Container>
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px solid #222;
  border-radius: 24px;
  overflow: hidden;
  background-color: #444;
`;

const InnerContainer = styled.div`
  position: absolute;
`;