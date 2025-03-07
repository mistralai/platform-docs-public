## FAQ

### How to validate data format? 

- Mistral API: We currently validate each file when you upload the dataset. 

- `mistral-finetune`: You can run the [data validation script](https://github.com/mistralai/mistral-finetune/blob/main/utils/validate_data.py) to validate the data and run the [reformat data script](https://github.com/mistralai/mistral-finetune/blob/main/utils/reformat_data.py) to reformat the data to the right format: 

    ```bash
    # download the reformat script
    wget https://raw.githubusercontent.com/mistralai/mistral-finetune/main/utils/reformat_data.py
    # download the validation script
    wget https://raw.githubusercontent.com/mistralai/mistral-finetune/main/utils/validate_data.py
    # reformat data
    python reformat_data.py data.jsonl
    # validate data
    python validate_data.py data.jsonl
    ```

    However, it's important to note that these scripts might not detect all problematic cases. Therefore, you may need to manually validate and correct any unique edge cases in your data.

### What's the size limit of the training data? 

While the size limit for an individual training data file is 512MB, there's no limitation on the number of files you can upload. You can upload multiple files and reference them when creating the job.

### What's the size limit of the validation data? 

The size limit for the validation data is 1MB. As a rule of thumb: 

`validation_set_max_size = min(1MB, 5% of training data)`


### How many epochs are in the training process? 

A general rule of thumb is: Num epochs = max_steps / file_of_training_jsonls_in_MB. For instance, if your training file is 100MB and you set max_steps=1000, the training process will roughly perform 10 epochs.

### Where can I find information on cost/ ETA / number of tokens / number of passes over each files?

Mistral API: When you create a fine-tuning job, you should automatically see these info with the default `auto_start=False` argument.

Note that the `dry_run=True` argument will be removed in September.

`mistral-finetune`: You can use the following script to find out: https://github.com/mistralai/mistral-finetune/blob/main/utils/validate_data.py. This script accepts a .yaml training file as input and returns the number of tokens the model is being trained on.

### How to estimate cost of a fine-tuning job?
For Mistral API, you can use the `auto_start=False` argument as mentioned in the previous question. 

### What is the recommended learning rate? 

For LoRA fine-tuning, we recommend 1e-4 (default) or 1e-5. 

Note that the learning rate we define is the peak learning rate, instead of a flat learning rate. The learning rate follows a linear warmup and cosine decay schedule. During the warmup phase, the learning rate is linearly increased from a small initial value to a larger value over a certain number of training steps. After the warmup phase, the learning rate is decayed using a cosine function.

### Is the fine-tuning API compatible with OpenAI data format?

Yes, we support OpenAI format.

### What if my file size is larger than 500MB and I get the error message `413 Request Entity Too Large`? 

You can split your data file into chunks. Here is an example:

<details>
```py
import json
from datasets import load_dataset

# get data from hugging face
ds = load_dataset("HuggingFaceH4/ultrachat_200k",split="train_gen")

# save data into .jsonl. This file is about 1.3GB
with open('train.jsonl', 'w') as f:
    for line in ds:
        json.dump(line, f)
        f.write('\n')

# reformat data 
!wget https://raw.githubusercontent.com/mistralai/mistral-finetune/main/utils/reformat_data.py
!python reformat_data.py train.jsonl

# Split file into three chunks 
input_file = "train.jsonl"
output_files = ["train_1.jsonl", "train_2.jsonl", "train_3.jsonl"]
# open the output files
output_file_objects = [open(file, "w") for file in output_files]
# counter for output files
counter = 0
with open(input_file, "r") as f_in:
    # read the input file line by line
    for line in f_in:
        # parse the line as JSON
        data = json.loads(line)
        # write the data to the current output file
        output_file_objects[counter].write(json.dumps(data) + "\n")
        # increment the counter
        counter = (counter + 1) % 3
# close the output files
for file in output_file_objects:
    file.close()

# now you should see three jsonl files under 500MB
```
</details>
