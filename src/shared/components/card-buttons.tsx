import styled, { css } from 'styled-components';

export function CardButtonOld(props: {label: React.ReactNode, onClick: () => void}) {
  return <button className="card-button" onClick={() => props.onClick()}>
    {props.label}
  </button>;
}

export const CardButton = styled.button`
  border: none;
  outline: none;
  appearance: none;
  border-radius: 3px;
  padding: 4px 4px;
  width: 100%;
  
  display: flex;

  text-align: right;
  background-color: #666;
  color: #CCC;
  font-weight: bold;

  &:hover {
    background-color: #555;
  }
`;

export function CardButtonsOld(props: {children: React.ReactNode, width: number, side: 'right' | 'left'}) {
  return <div className="card-buttons" style={{width: props.width + "px"}}>
    {props.children}
  </div>;
}

//transform: translateX(${p => p.side === 'left' ? "-100%" : cardWidth + "px"});
export const CardButtons = styled.div<{width: number, side: 'right' | 'left'}>`
  width: ${p => p.width}px;
  z-index: -1;
  position: absolute; 
  ${p => p.side === 'left' ? css`
    left: -34px;
  ` : css`
    right: -34px; 
  `}
  top: 5px;
  padding: 6px 6px 6px 6px;
  display: flex;
  flex-direction: column;
  grid-gap: 10px;
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 5px;

  button {
    position: relative;
    ${p => p.side === 'left' ? css`
    ` : css`
      justify-content: end;
    `}
  }
`;