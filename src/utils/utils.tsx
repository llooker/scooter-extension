import {startCase, toLower} from 'lodash'

export const titleCaseHelper = (str) => {
  return startCase(toLower(str));
}