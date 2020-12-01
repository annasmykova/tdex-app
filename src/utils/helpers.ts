import { Assets, defaultPrecision } from './constants';

export const getEdgeAsset = (asset_id: string) => {
  return Object.values(Assets).find((item: any) => item.assetHash === asset_id);
};

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export function fromSatoshi(x: number, y?: number): string {
  return (x / Math.pow(10, y || defaultPrecision)).toFixed(2);
}
