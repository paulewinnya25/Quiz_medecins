declare module 'qrcodejs' {
  export default class QRCode {
    constructor(element: HTMLElement | string, options?: QRCode.Options);
    
    static CorrectLevel: {
      L: number;
      M: number;
      Q: number;
      H: number;
    };
  }
  
  namespace QRCode {
    interface Options {
      text?: string;
      width?: number;
      height?: number;
      colorDark?: string;
      colorLight?: string;
      correctLevel?: number;
    }
  }
}

