import os
import json
import openai
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
load_dotenv()

# Set your API keys (environment variables recommended)
openai.api_key = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
# Set the region you plan to use (e.g., 'us-west-2')
PINECONE_REGION = os.getenv("PINECONE_REGION", "us-west-2")

# Create a Pinecone client instance
pc = Pinecone(api_key=PINECONE_API_KEY)

index_name = "combined-index"
embedding_dim = 1536  # For text-embedding-ada-002
metric = "euclidean"  # or use "cosine" if preferred

# Check if the index exists; if not, create it using a serverless spec.
indexes = pc.list_indexes().names()
if index_name not in indexes:
    pc.create_index(
        name=index_name,
        dimension=embedding_dim,
        metric=metric,
        spec=ServerlessSpec(
            cloud="aws",
            region=PINECONE_REGION
        )
    )
    print(f"Index '{index_name}' created.")
else:
    print(f"Index '{index_name}' already exists.")

# Get the index object
index = pc.Index(index_name)

# Load JSON files
with open("./data/tmcf_jobs.json", "r") as f:
    jobs = json.load(f)

with open("./data/uncf_opportunities.json", "r") as f:
    opportunities = json.load(f)

# Combine records into a unified format with metadata.
combined_records = []

# Process TMCF jobs
for i, record in enumerate(jobs):
    text = (
        f"Job Title: {record.get('Job Title', '')}. "
        f"Location: {record.get('Location', '')}. "
        f"Type: {record.get('Type', '')}. "
        f"URL: {record.get('URL', '')}."
    )
    combined_records.append({
        "id": f"tmcf_{i}",
        "text": text,
        "metadata": {
            "source": "tmcf_jobs",
            "original": json.dumps(record)
        }
    })

# Process UNCF opportunities
for i, record in enumerate(opportunities):
    text = (
        f"Program Name: {record.get('Program Name', '')}. "
        f"Program Type: {record.get('Program Type', '')}. "
        f"Award Year: {record.get('Award Year', '')}. "
        f"Open Date: {record.get('Open Date', '')}. "
        f"Deadline: {record.get('Deadline', '')}. "
        f"Application Link: {record.get('Application Link', '')}."
    )
    combined_records.append({
        "id": f"uncf_{i}",
        "text": text,
        "metadata": {
            "source": "uncf_opportunities",
            "original": json.dumps(record)
        }
    })

client = OpenAI()
# Function to generate embeddings using OpenAI's API
def get_embeddings(texts, model="text-embedding-3-small"):
    # Create embeddings for all texts
    response = client.embeddings.create(input = texts, model=model)
    # Extract embeddings for each text
    embeddings = [entry.embedding for entry in response.data]
    return embeddings


# Upsert records in batches
batch_size = 100  # Adjust based on your dataset size
for i in range(0, len(combined_records), batch_size):
    batch = combined_records[i:i+batch_size]
    texts = [item["text"] for item in batch]
    ids = [item["id"] for item in batch]
    metadata_list = [item["metadata"] for item in batch]
    
    # Generate embeddings for the current batch
    embeddings = get_embeddings(texts)
    
    # Prepare vectors: each is a tuple (id, embedding, metadata)
    vectors = list(zip(ids, embeddings, metadata_list))
    index.upsert(vectors=vectors)
    print(f"Upserted batch {i // batch_size + 1}")

print("All records have been vectorized and upserted into the Pinecone index!")
