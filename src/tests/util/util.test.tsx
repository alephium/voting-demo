import { hexStringToStr, strToHexString } from '../../util/util'

it('should encode/decode hexstring', () => {
  const str = 'Do you accept our proposal?'
  expect(hexStringToStr(strToHexString(str))).toBe(str)
})
