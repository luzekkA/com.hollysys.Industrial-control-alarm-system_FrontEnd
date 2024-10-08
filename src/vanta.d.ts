declare module 'vanta/src/vanta.birds.js' {
    import { VantaBase } from 'vanta';
  
    interface VantaBirdsOptions {
      el: string | HTMLElement;
      THREE: any;
      color1?: number;
      color2?: number;
      backgroundColor?: number;
      birdSize?: number;
      wingSpan?: number;
      speedLimit?: number;
      separation?: number;
      alignment?: number;
      cohesion?: number;
      quantity?: number;
    }
  
    export default function BIRDS(options: VantaBirdsOptions): VantaBase;
  }