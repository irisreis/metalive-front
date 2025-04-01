// src/polyfills.ts

//import '@angular/localize/init';
//(window as any).global = window;
//import 'stream-http'; 
//import 'https-browserify'; 
//import 'browserify-zlib'; 
//import 'stream-browserify'; 
//import 'constants-browserify'; 
//import 'crypto-browserify'; 
//import 'zone.js';
(window as any).global = window;
import '@angular/localize/init';
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;
