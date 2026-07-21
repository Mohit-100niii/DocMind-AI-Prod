from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

#reader = PdfReader("D:\\rag-learning\\DocMindAi\\documents\\employee_handbook.pdf")


splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=20
    )


def extract_text_from_pdf(reader):
    text = ""
    for page in reader.pages:
        text += page.extract_text()

    chunks = splitter.split_text(text)
    return chunks

    


