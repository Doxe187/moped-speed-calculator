categories = []

const range_front = (start,end, step = 1) => {
  //error message for start/end
  if (start > end) {
  alert("start can't be biggger then end")
  }

  Array.from(
{ length: Math.floor((end - start / step) + 1),
  (_,i) => String(start + i * step)
}
cons categories = {
  'ccm': ['50','75','5'],
  'translation_front': ['9', '16'],
  'translation_back': ['36', '52'],
