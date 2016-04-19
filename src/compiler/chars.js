'use strict';"use strict";
exports.$EOF = 0;
exports.$TAB = 9;
exports.$LF = 10;
exports.$VTAB = 11;
exports.$FF = 12;
exports.$CR = 13;
exports.$SPACE = 32;
exports.$BANG = 33;
exports.$DQ = 34;
exports.$HASH = 35;
exports.$$ = 36;
exports.$PERCENT = 37;
exports.$AMPERSAND = 38;
exports.$SQ = 39;
exports.$LPAREN = 40;
exports.$RPAREN = 41;
exports.$STAR = 42;
exports.$PLUS = 43;
exports.$COMMA = 44;
exports.$MINUS = 45;
exports.$PERIOD = 46;
exports.$SLASH = 47;
exports.$COLON = 58;
exports.$SEMICOLON = 59;
exports.$LT = 60;
exports.$EQ = 61;
exports.$GT = 62;
exports.$QUESTION = 63;
exports.$0 = 48;
exports.$9 = 57;
exports.$A = 65;
exports.$E = 69;
exports.$Z = 90;
exports.$LBRACKET = 91;
exports.$BACKSLASH = 92;
exports.$RBRACKET = 93;
exports.$CARET = 94;
exports.$_ = 95;
exports.$a = 97;
exports.$e = 101;
exports.$f = 102;
exports.$n = 110;
exports.$r = 114;
exports.$t = 116;
exports.$u = 117;
exports.$v = 118;
exports.$z = 122;
exports.$LBRACE = 123;
exports.$BAR = 124;
exports.$RBRACE = 125;
exports.$NBSP = 160;
exports.$PIPE = 124;
exports.$TILDA = 126;
exports.$AT = 64;
function isWhitespace(code) {
    return (code >= exports.$TAB && code <= exports.$SPACE) || (code == exports.$NBSP);
}
exports.isWhitespace = isWhitespace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLVVUYTd6emJOLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvY2hhcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFhLFlBQUksR0FBRyxDQUFDLENBQUM7QUFDVCxZQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ1QsV0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNULGFBQUssR0FBRyxFQUFFLENBQUM7QUFDWCxXQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ1QsV0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNULGNBQU0sR0FBRyxFQUFFLENBQUM7QUFDWixhQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ1gsV0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNULGFBQUssR0FBRyxFQUFFLENBQUM7QUFDWCxVQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ1IsZ0JBQVEsR0FBRyxFQUFFLENBQUM7QUFDZCxrQkFBVSxHQUFHLEVBQUUsQ0FBQztBQUNoQixXQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ1QsZUFBTyxHQUFHLEVBQUUsQ0FBQztBQUNiLGVBQU8sR0FBRyxFQUFFLENBQUM7QUFDYixhQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ1gsYUFBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLGNBQU0sR0FBRyxFQUFFLENBQUM7QUFDWixjQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ1osZUFBTyxHQUFHLEVBQUUsQ0FBQztBQUNiLGNBQU0sR0FBRyxFQUFFLENBQUM7QUFDWixjQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ1osa0JBQVUsR0FBRyxFQUFFLENBQUM7QUFDaEIsV0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNULFdBQUcsR0FBRyxFQUFFLENBQUM7QUFDVCxXQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ1QsaUJBQVMsR0FBRyxFQUFFLENBQUM7QUFFZixVQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ1IsVUFBRSxHQUFHLEVBQUUsQ0FBQztBQUVSLFVBQUUsR0FBRyxFQUFFLENBQUM7QUFDUixVQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ1IsVUFBRSxHQUFHLEVBQUUsQ0FBQztBQUVSLGlCQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ2Ysa0JBQVUsR0FBRyxFQUFFLENBQUM7QUFDaEIsaUJBQVMsR0FBRyxFQUFFLENBQUM7QUFDZixjQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ1osVUFBRSxHQUFHLEVBQUUsQ0FBQztBQUVSLFVBQUUsR0FBRyxFQUFFLENBQUM7QUFDUixVQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ1QsVUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNULFVBQUUsR0FBRyxHQUFHLENBQUM7QUFDVCxVQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ1QsVUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNULFVBQUUsR0FBRyxHQUFHLENBQUM7QUFDVCxVQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ1QsVUFBRSxHQUFHLEdBQUcsQ0FBQztBQUVULGVBQU8sR0FBRyxHQUFHLENBQUM7QUFDZCxZQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ1gsZUFBTyxHQUFHLEdBQUcsQ0FBQztBQUNkLGFBQUssR0FBRyxHQUFHLENBQUM7QUFFWixhQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ1osY0FBTSxHQUFHLEdBQUcsQ0FBQztBQUNiLFdBQUcsR0FBRyxFQUFFLENBQUM7QUFFdEIsc0JBQTZCLElBQVk7SUFDdkMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLFlBQUksSUFBSSxJQUFJLElBQUksY0FBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksYUFBSyxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQUZlLG9CQUFZLGVBRTNCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgJEVPRiA9IDA7XG5leHBvcnQgY29uc3QgJFRBQiA9IDk7XG5leHBvcnQgY29uc3QgJExGID0gMTA7XG5leHBvcnQgY29uc3QgJFZUQUIgPSAxMTtcbmV4cG9ydCBjb25zdCAkRkYgPSAxMjtcbmV4cG9ydCBjb25zdCAkQ1IgPSAxMztcbmV4cG9ydCBjb25zdCAkU1BBQ0UgPSAzMjtcbmV4cG9ydCBjb25zdCAkQkFORyA9IDMzO1xuZXhwb3J0IGNvbnN0ICREUSA9IDM0O1xuZXhwb3J0IGNvbnN0ICRIQVNIID0gMzU7XG5leHBvcnQgY29uc3QgJCQgPSAzNjtcbmV4cG9ydCBjb25zdCAkUEVSQ0VOVCA9IDM3O1xuZXhwb3J0IGNvbnN0ICRBTVBFUlNBTkQgPSAzODtcbmV4cG9ydCBjb25zdCAkU1EgPSAzOTtcbmV4cG9ydCBjb25zdCAkTFBBUkVOID0gNDA7XG5leHBvcnQgY29uc3QgJFJQQVJFTiA9IDQxO1xuZXhwb3J0IGNvbnN0ICRTVEFSID0gNDI7XG5leHBvcnQgY29uc3QgJFBMVVMgPSA0MztcbmV4cG9ydCBjb25zdCAkQ09NTUEgPSA0NDtcbmV4cG9ydCBjb25zdCAkTUlOVVMgPSA0NTtcbmV4cG9ydCBjb25zdCAkUEVSSU9EID0gNDY7XG5leHBvcnQgY29uc3QgJFNMQVNIID0gNDc7XG5leHBvcnQgY29uc3QgJENPTE9OID0gNTg7XG5leHBvcnQgY29uc3QgJFNFTUlDT0xPTiA9IDU5O1xuZXhwb3J0IGNvbnN0ICRMVCA9IDYwO1xuZXhwb3J0IGNvbnN0ICRFUSA9IDYxO1xuZXhwb3J0IGNvbnN0ICRHVCA9IDYyO1xuZXhwb3J0IGNvbnN0ICRRVUVTVElPTiA9IDYzO1xuXG5leHBvcnQgY29uc3QgJDAgPSA0ODtcbmV4cG9ydCBjb25zdCAkOSA9IDU3O1xuXG5leHBvcnQgY29uc3QgJEEgPSA2NTtcbmV4cG9ydCBjb25zdCAkRSA9IDY5O1xuZXhwb3J0IGNvbnN0ICRaID0gOTA7XG5cbmV4cG9ydCBjb25zdCAkTEJSQUNLRVQgPSA5MTtcbmV4cG9ydCBjb25zdCAkQkFDS1NMQVNIID0gOTI7XG5leHBvcnQgY29uc3QgJFJCUkFDS0VUID0gOTM7XG5leHBvcnQgY29uc3QgJENBUkVUID0gOTQ7XG5leHBvcnQgY29uc3QgJF8gPSA5NTtcblxuZXhwb3J0IGNvbnN0ICRhID0gOTc7XG5leHBvcnQgY29uc3QgJGUgPSAxMDE7XG5leHBvcnQgY29uc3QgJGYgPSAxMDI7XG5leHBvcnQgY29uc3QgJG4gPSAxMTA7XG5leHBvcnQgY29uc3QgJHIgPSAxMTQ7XG5leHBvcnQgY29uc3QgJHQgPSAxMTY7XG5leHBvcnQgY29uc3QgJHUgPSAxMTc7XG5leHBvcnQgY29uc3QgJHYgPSAxMTg7XG5leHBvcnQgY29uc3QgJHogPSAxMjI7XG5cbmV4cG9ydCBjb25zdCAkTEJSQUNFID0gMTIzO1xuZXhwb3J0IGNvbnN0ICRCQVIgPSAxMjQ7XG5leHBvcnQgY29uc3QgJFJCUkFDRSA9IDEyNTtcbmV4cG9ydCBjb25zdCAkTkJTUCA9IDE2MDtcblxuZXhwb3J0IGNvbnN0ICRQSVBFID0gMTI0O1xuZXhwb3J0IGNvbnN0ICRUSUxEQSA9IDEyNjtcbmV4cG9ydCBjb25zdCAkQVQgPSA2NDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIChjb2RlID49ICRUQUIgJiYgY29kZSA8PSAkU1BBQ0UpIHx8IChjb2RlID09ICROQlNQKTtcbn1cbiJdfQ==