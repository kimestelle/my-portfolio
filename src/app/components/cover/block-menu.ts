import './block-menu.css';

interface BlockImage {
  name: string;
  src: string;
  className: string;
}

const blockImages: BlockImage[] = [
  { name: 'love', src: '/skyline-images/love.svg', className: 'love' },
  { name: 'tree', src: '/skyline-images/tree.svg', className: 'tree' },
  { name: 'rectangle', src: '/skyline-images/rectangle.svg', className: 'rectangle' },
  { name: 'tower', src: '/skyline-images/tower.svg', className: 'tower' },
  { name: 'shrub', src: '/skyline-images/shrub.svg', className: 'shrub' },
  { name: 'circle', src: '/skyline-images/circle.svg', className: 'circle' },
  { name: 'hill', src: '/skyline-images/hill.svg', className: 'hill' },
  { name: 'arch', src: '/skyline-images/arch.svg', className: 'arch' },
  { name: 'sign', src: '/skyline-images/sign.svg', className: 'sign' },
  { name: 'sprite', src: '/skyline-images/sprite.svg', className: 'sprite' },
  { name: 'sprite', src: '/skyline-images/sprite.svg', className: 'sprite' },
  { name: 'sprite', src: '/skyline-images/sprite.svg', className: 'sprite' },
  { name: 'sprite', src: '/skyline-images/sprite.svg', className: 'sprite' },
  { name: 'sprite', src: '/skyline-images/sprite.svg', className: 'sprite' },
];

export default blockImages;
