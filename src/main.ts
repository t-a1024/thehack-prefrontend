import { DocumentSymbol, SymbolKind } from 'vscode-languageserver-types';

/**
 * SymbolKindの全要素を取得して出力するプログラム
 */
function printAllSymbolKinds() {
  console.log("=== SymbolKind 全一覧 ===");

  // TypeScriptのenumは「名前→数値」と「数値→名前」の両方がオブジェクトに格納されるため、
  // 文字列のキー（File, Moduleなど）だけをフィルタリングして抽出します。
  const symbolNames = Object.keys(SymbolKind).filter(key => isNaN(Number(key)));

  // 取得した名前を使って、それぞれの数値（ID）とセットで出力します
  symbolNames.forEach(name => {
    const value = SymbolKind[name as keyof typeof SymbolKind];
    console.log(`ID: ${value.toString().padStart(2, ' ')} | Name: ${name}`);
  });
  
  console.log("=========================");
  console.log(`合計: ${symbolNames.length} 種類`);
}

// 実行
printAllSymbolKinds();