import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

export interface Coords {
  x: number;
  y: number;
}

export function ScrollableContainer(props: {defaultCenter: Coords, children: ReactNode}) {
  const ref = useRef<HTMLDivElement>(null);
  const [panOffset, setPanOffset] = useState<Coords>({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const width = ref.current.offsetWidth;
    const height = ref.current.offsetHeight;
    setPanOffset({x: props.defaultCenter.x + width/2, y: props.defaultCenter.y + height/2});
  }, [setPanOffset]);

  const moveMouse = useCallback((evt: React.MouseEvent<Element, MouseEvent>) => {
    if (isDragging) {
      setPanOffset({ x: evt.movementX + panOffset.x, y: evt.movementY + panOffset.y });
    }
  }, [isDragging, panOffset, setPanOffset]);

  return <Container
    ref={ref}
    onMouseDown={() => setIsDragging(true)}
    onMouseUp={() => setIsDragging(false)}
    onMouseMove={(evt) => moveMouse(evt)}
    onMouseLeave={() => setIsDragging(false)}
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
  border-radius: 24px;
  overflow: hidden;
  background-color: #444;
  box-shadow: 0 0 5px 1px #777 inset;
`;

const InnerContainer = styled.div`
  position: absolute;
`;