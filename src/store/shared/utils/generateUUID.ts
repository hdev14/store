/* eslint-disable func-names */
import { v4 } from 'uuid';
import IGenerateID from './IGenerateID';

const generateUUID: IGenerateID = function () {
  return v4();
};

export default generateUUID;
