from transformers import pipeline
from markdown import Markdown
from io import StringIO

def unmark_element(element, stream=None):
    if stream is None:
        stream = StringIO()
    if element.text:
        stream.write(element.text)
    for sub in element:
        unmark_element(sub, stream)
    if element.tail:
        stream.write(element.tail)
    return stream.getvalue()

def unmark(mkdwn):
    # patching Markdown
    Markdown.output_formats["plain"] = unmark_element
    __md = Markdown(output_format="plain")
    __md.stripTopLevelTags = False
    return __md.convert(mkdwn)    

def summarize_this(input,model):
    unmarked_input = unmark(input)
    print("model : ", model)
    summarizer = pipeline("summarization", model=model)
    split_input = unmarked_input.split()
    print("split_input : ", split_input)
    length_of_unmarked_input = len(split_input)
    max = length_of_unmarked_input//3
    min = length_of_unmarked_input//4
    print("length_of_unmarked_input : ", length_of_unmarked_input)
    print("max : ", max)
    print("min : ", min)
    summary = summarizer(unmarked_input, do_sample=False)
    # print("summary : ", summary)
     # Extract and return the summary text
    if len(summary) > 0:
        return summary[0]['summary_text']
    else:
        return ''