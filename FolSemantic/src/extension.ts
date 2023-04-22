import * as vscode from 'vscode';

const tokenTypes = new Map<string, number>();
const tokenModifiers = new Map<string, number>();

const legend = (function() {
	const tokenTypesLegend = [
		'comment', 'string', 'keyword', 'number', 'regexp', 'operator', 'namespace','other',
		'type', 'struct', 'class', 'interface', 'enum', 'typeParameter', 'function',
		'method', 'decorator', 'macro', 'variable', 'parameter', 'property', 'label'
	];
	tokenTypesLegend.forEach((tokenType, index) => tokenTypes.set(tokenType, index));

	const tokenModifiersLegend = [
		'declaration', 'documentation', 'readonly', 'static', 'abstract', 'deprecated',
		'modification', 'async'
	];
	tokenModifiersLegend.forEach((tokenModifier, index) => tokenModifiers.set(tokenModifier, index));

	return new vscode.SemanticTokensLegend(tokenTypesLegend, tokenModifiersLegend);
})();

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: 'fol' }, new DocumentSemanticTokensProvider(), legend));
}

interface IParsedToken {
	line: number;
	startCharacter: number;
	length: number;
	tokenType: string;
	tokenModifiers: string[];
}
var foundArithmetic=false;


class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
	async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
        foundArithmetic=false;
		const allTokens = this._parseText(document.getText());
		const builder = new vscode.SemanticTokensBuilder();
		allTokens.forEach((token) => {
			builder.push(token.line, token.startCharacter, token.length, this._encodeTokenType(token.tokenType), this._encodeTokenModifiers(token.tokenModifiers));
		});
		return builder.build();
	}

	private _encodeTokenType(tokenType: string): number {

		if(tokenType=="comment")
		    return 0;

			if(tokenType.match(/-[a-zA-Z]+[0-9A-Za-z_\-]+\b/))
		    return 14;

			if(tokenType.match(/".*"\b/))
		    return 1;





 if(tokenType==="formulas(assumptions)" ||   tokenType=="set" || tokenType==="clear" || tokenType==="assign"  || tokenType==="assign("
  || tokenType=="end_of_list" || tokenType=="goals" ||  tokenType=="formulas(goals)"||  tokenType==="clear(" ||
 tokenType=="set(" || tokenType=="assumptions" || tokenType=="demodulators" || tokenType=="formulas(sos)" || tokenType=="formulas(usable)" 
  || tokenType=="list" || tokenType=="distinct"  || tokenType=="hints" || tokenType=="formulas(hints)" || tokenType=="list(distinct)"|| tokenType=="redeclare" || tokenType=="redeclare("    ) 
		 return 2;


		 if(tokenType=="domain_size"||tokenType=="max_models"|| tokenType=="backward_implication"  ||
	     tokenType=="backward_implication" ||  tokenType=="disjunction" ||  tokenType=="conjunction"  || 
		 tokenType== "max_proofs" ||tokenType=="binary_resolution"||tokenType=="max_seconds"||
		 tokenType=="max_weight"||tokenType=="prolog_style_variables" || tokenType=="production"||
		 tokenType== "paramodulation"|| tokenType=="print_gen"||
		 tokenType=="(domain_size)"||tokenType=="(max_models)"||  tokenType=="(disjunction)" ||  tokenType=="(conjunction)"  || tokenType=="(backward_implication)"  ||
		 tokenType== "(max_proofs)" ||tokenType=="(binary_resolution)"||tokenType=="(max_seconds)"||
		 tokenType=="(max_weight)"||tokenType=="(prolog_style_variables)" || tokenType=="(production)"||
		 tokenType== "(paramodulation)"|| tokenType=="(print_gen)"||

		 tokenType=="domain_size)"||tokenType=="max_models)"|| tokenType=="disjunction)" ||  tokenType=="conjunction)"  || tokenType=="backward_implication)"  ||
		 tokenType== "(max_proofs)" ||tokenType=="(binary_resolution)"||tokenType=="max_seconds)"||
		 tokenType=="max_weight)"||tokenType=="prolog_style_variables)" || tokenType=="production)"||
		 tokenType== "paramodulation)"|| tokenType=="print_gen)"||

		 tokenType=="(domain_size"||tokenType=="(max_models"|| 
		 tokenType== "(max_proofs" ||tokenType=="(binary_resolution"||tokenType=="(max_seconds"|| tokenType=="(disjunction" ||  tokenType=="(conjunction"  || tokenType=="(backward_implication"  ||
		 tokenType=="(max_weight"||tokenType=="(prolog_style_variables)" || tokenType=="(production"||
		 tokenType== "(paramodulation"|| tokenType=="(print_gen"


		 
		 
		 )
		 return 19;

  
  if(foundArithmetic==true && tokenType.match(/\b[0-9]+\b/))
	   return 3;

 if(tokenType=="arithmetic" || tokenType=="set(arithmetic)"  )
 {
	foundArithmetic=true;
	return 10;

 }
 
 if(tokenType=="!" || tokenType=="&" || tokenType=="->" ||  tokenType=="<->"  || tokenType=="<-" || tokenType=="|" || tokenType=="."
 || tokenType=="all" || tokenType=="exists" || tokenType=="$F" || tokenType=="$T")
	return 17;

	if(foundArithmetic==true &&
	 (tokenType=="+" || tokenType=="-" || tokenType=="/" ||  tokenType=="*"  || tokenType=="^"
	  || tokenType==">"  ||  tokenType=="="  ||  tokenType=="<"  || tokenType==">="  ||  tokenType=="<="  ||  tokenType=="<>"
	  || tokenType=="mod"  || tokenType=="mix" || tokenType=="max" || tokenType=="abs" || tokenType=="!="
	 
	  )     )
		 return 17;



return 24;
	}

	private _encodeTokenModifiers(strTokenModifiers: string[]): number {
		let result = 0;
		for (let i = 0; i < strTokenModifiers.length; i++) {
			const tokenModifier = strTokenModifiers[i];
			if (tokenModifiers.has(tokenModifier)) {
				result = result | (1 << tokenModifiers.get(tokenModifier)!);
			} else if (tokenModifier === 'notInLegend') {
				result = result | (1 << tokenModifiers.size + 2);
			}
		}
		return result;
	}

	private _parseText(text: string): IParsedToken[] {
		const r: IParsedToken[] = [];
		const lines = text.split(/\r\n|\r|\n/);
	       
		
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			console.log(line)
			let currentOffset = 0;
			let doneParseLine=false
			var comment=false;
			var openOffset=-1;
			do {
				
	    		var closeOffset = line.indexOf(' ', openOffset+1);

				if (closeOffset === -1) {
					closeOffset=line.length;
					doneParseLine=true
					
				}
				var tokenData = {tokenType:"",tokenModifiers:[""]}
				var tokenData2 = {tokenType:"",tokenModifiers:[""]}


                var tobeAnalysed=line.substring(openOffset+1, closeOffset);
				var lista=[" "] 
				

				 
                        
				
				      if(tobeAnalysed==".")
                          lista=["."]
						  else
						  lista= tobeAnalysed.split(".")

				tokenData = this._parseTextToken(lista[0]);
				

				if(tokenData.tokenType[0]=="%")
				comment=true;
	     
                       

				   if(!comment)
				r.push({
					line: i,
					startCharacter: openOffset + 1,
					length: lista[0].length,
					tokenType: tokenData.tokenType,
					tokenModifiers: tokenData.tokenModifiers
				});
				else
				r.push({
					line: i,
					startCharacter: openOffset + 1,
					length: closeOffset - openOffset - 1,
					tokenType: "comment",
					tokenModifiers: []
				});
              
				if(lista.length>1)
				{
					tokenData2 = this._parseTextToken(lista.splice(1)+".");
				 
					if(!comment)
					r.push({
						line: i,
						startCharacter: openOffset +lista[0].length+1,
						length: closeOffset - openOffset-lista[0].length,
						tokenType: tokenData2.tokenType,
						tokenModifiers: tokenData2.tokenModifiers
					});
					else
					r.push({
						line: i,
						startCharacter: openOffset +lista[0].length,
						length: closeOffset - openOffset-lista[0].length,
						tokenType: "comment",
						tokenModifiers: []
					});
				  
				}



                openOffset=closeOffset;
				currentOffset = closeOffset;
				if(doneParseLine==true)
				  break;
			} while (true);
		}
		return r;
	}

	private _parseTextToken(text: string): { tokenType: string; tokenModifiers: string[]; } {
		return {
			tokenType: text,
			tokenModifiers: []
		};
	}
}
