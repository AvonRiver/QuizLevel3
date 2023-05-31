import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boldAllOccurances'
})
export class BoldAllOccurancesPipe implements PipeTransform {
  transform(targetPhrase: string = "", highlightKey: string | null= ''): string {

    if (highlightKey === '' || highlightKey === null || targetPhrase === '') {
      return targetPhrase;
    }

    const START_BOLD = '<b>';
    const END_BOLD = '</b>';
    const LENGTH_BOLD = START_BOLD.length + END_BOLD.length

    const highlightTerm = highlightKey.toLowerCase();

    let result = targetPhrase;

    let startIndex = 0;

    let foundIndex = targetPhrase.toLowerCase().indexOf(highlightTerm, startIndex);

    while (foundIndex >= startIndex) {

      result = result.substring(0, foundIndex) + START_BOLD
        + result.substring(foundIndex, highlightKey.length + foundIndex)
        + END_BOLD
        + result.substring(highlightKey.length + foundIndex);

        startIndex += highlightKey.length + LENGTH_BOLD;

        foundIndex = result.toLowerCase().indexOf(highlightTerm, startIndex);
    }
    return result;
  }
}
