import CustomPalette from './customPalette'
import CustomRenderer from './customRenderer'
export default {
    __init__: ['customPalette', 'customRenderer'],
    customPalette: ['type', CustomPalette],
    customRenderer: ['type', CustomRenderer]
}