---
id: basic_ocr
title: Basic OCR 
slug: basic_ocr
sidebar_position: 3.1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Document AI OCR processor 

Mistral Document AI API comes with a Document OCR (Optical Character Recognition) processor, powered by our latest OCR model `mistral-ocr-latest`, which enables you to extract text and structured content from PDF documents. 

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/basic_ocr_graph.png"
    alt="Basic OCR Graph"
    width="600"
    style={{ borderRadius: '15px' }}
  />
</div>

**Key features**:
- Extracts text content while maintaining document structure and hierarchy
- Preserves formatting like headers, paragraphs, lists and tables
- Returns results in markdown format for easy parsing and rendering
- Handles complex layouts including multi-column text and mixed content
- Processes documents at scale with high accuracy
- Supports multiple document formats including:
    - `image_url`: png, jpeg/jpg, avif and more...
    - `document_url`: pdf, pptx, docx and more...

The OCR processor returns the extracted **text content**, **images bboxes** and metadata about the document structure, making it easy to work with the recognized content programmatically.

### OCR with PDF

<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
import os
from mistralai import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key)

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "document_url",
        "document_url": "https://arxiv.org/pdf/2201.04234"
    },
    include_image_base64=True
)
```

Or passing a Base64 encoded pdf:
```python
import base64
import os
from mistralai import Mistral

def encode_pdf(pdf_path):
    """Encode the pdf to base64."""
    try:
        with open(pdf_path, "rb") as pdf_file:
            return base64.b64encode(pdf_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: The file {pdf_path} was not found.")
        return None
    except Exception as e:  # Added general exception handling
        print(f"Error: {e}")
        return None

# Path to your pdf
pdf_path = "path_to_your_pdf.pdf"

# Getting the base64 string
base64_pdf = encode_pdf(pdf_path)

api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key)

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "document_url",
        "document_url": f"data:application/pdf;base64,{base64_pdf}" 
    },
    include_image_base64=True
)
```
  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

const ocrResponse = await client.ocr.process({
    model: "mistral-ocr-latest",
    document: {
        type: "document_url",
        documentUrl: "https://arxiv.org/pdf/2201.04234"
    },
    includeImageBase64: true
});
```

Or passing a Base64 encoded pdf:
```ts
import { Mistral } from '@mistralai/mistralai';
import fs from 'fs';

async function encodePdf(pdfPath) {
    try {
        // Read the PDF file as a buffer
        const pdfBuffer = fs.readFileSync(pdfPath);

        // Convert the buffer to a Base64-encoded string
        const base64Pdf = pdfBuffer.toString('base64');
        return base64Pdf;
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

const pdfPath = "path_to_your_pdf.pdf";

const base64Pdf = await encodePdf(pdfPath);

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

try {
    const ocrResponse = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
            type: "document_url",
            documentUrl: "data:application/pdf;base64," + base64Pdf
        },
        includeImageBase64: true
    });
    console.log(ocrResponse);
} catch (error) {
    console.error("Error processing OCR:", error);
}
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl https://api.mistral.ai/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
        "type": "document_url",
        "document_url": "https://arxiv.org/pdf/2201.04234"
    },
    "include_image_base64": true
  }' -o ocr_output.json
```

Or passing a Base64 encoded pdf:
```bash
curl https://api.mistral.ai/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
        "type": "document_url",
        "document_url": "data:application/pdf;base64,<base64_pdf>"
    },
    "include_image_base64": true
  }' -o ocr_output.json
```
  </TabItem>
</Tabs>


<details>
<summary><b>Example output:</b></summary>


```json
{
    "pages": [
        {
            "index": 1,
            "markdown": "# LEVERAGING UNLABELED DATA TO PREDICT OUT-OF-DISTRIBUTION PERFORMANCE \n\nSaurabh Garg*<br>Carnegie Mellon University<br>sgarg2@andrew.cmu.edu<br>Sivaraman Balakrishnan<br>Carnegie Mellon University<br>sbalakri@andrew.cmu.edu<br>Zachary C. Lipton<br>Carnegie Mellon University<br>zlipton@andrew.cmu.edu\n\n## Behnam Neyshabur\n\nGoogle Research, Blueshift team\nneyshabur@google.com\n\nHanie Sedghi<br>Google Research, Brain team<br>hsedghi@google.com\n\n\n#### Abstract\n\nReal-world machine learning deployments are characterized by mismatches between the source (training) and target (test) distributions that may cause performance drops. In this work, we investigate methods for predicting the target domain accuracy using only labeled source data and unlabeled target data. We propose Average Thresholded Confidence (ATC), a practical method that learns a threshold on the model's confidence, predicting accuracy as the fraction of unlabeled examples for which model confidence exceeds that threshold. ATC outperforms previous methods across several model architectures, types of distribution shifts (e.g., due to synthetic corruptions, dataset reproduction, or novel subpopulations), and datasets (WILDS, ImageNet, BREEDS, CIFAR, and MNIST). In our experiments, ATC estimates target performance $2-4 \\times$ more accurately than prior methods. We also explore the theoretical foundations of the problem, proving that, in general, identifying the accuracy is just as hard as identifying the optimal predictor and thus, the efficacy of any method rests upon (perhaps unstated) assumptions on the nature of the shift. Finally, analyzing our method on some toy distributions, we provide insights concerning when it works ${ }^{1}$.\n\n\n## 1 INTRODUCTION\n\nMachine learning models deployed in the real world typically encounter examples from previously unseen distributions. While the IID assumption enables us to evaluate models using held-out data from the source distribution (from which training data is sampled), this estimate is no longer valid in presence of a distribution shift. Moreover, under such shifts, model accuracy tends to degrade (Szegedy et al., 2014; Recht et al., 2019; Koh et al., 2021). Commonly, the only data available to the practitioner are a labeled training set (source) and unlabeled deployment-time data which makes the problem more difficult. In this setting, detecting shifts in the distribution of covariates is known to be possible (but difficult) in theory (Ramdas et al., 2015), and in practice (Rabanser et al., 2018). However, producing an optimal predictor using only labeled source and unlabeled target data is well-known to be impossible absent further assumptions (Ben-David et al., 2010; Lipton et al., 2018).\n\nTwo vital questions that remain are: (i) the precise conditions under which we can estimate a classifier's target-domain accuracy; and (ii) which methods are most practically useful. To begin, the straightforward way to assess the performance of a model under distribution shift would be to collect labeled (target domain) examples and then to evaluate the model on that data. However, collecting fresh labeled data from the target distribution is prohibitively expensive and time-consuming, especially if the target distribution is non-stationary. Hence, instead of using labeled data, we aim to use unlabeled data from the target distribution, that is comparatively abundant, to predict model performance. Note that in this work, our focus is not to improve performance on the target but, rather, to estimate the accuracy on the target for a given classifier.\n\n[^0]\n[^0]:    * Work done in part while Saurabh Garg was interning at Google\n    ${ }^{1}$ Code is available at https://github.com/saurabhgarg1996/ATC_code.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 2,
            "markdown": "![img-0.jpeg](img-0.jpeg)\n\nFigure 1: Illustration of our proposed method ATC. Left: using source domain validation data, we identify a threshold on a score (e.g. negative entropy) computed on model confidence such that fraction of examples above the threshold matches the validation set accuracy. ATC estimates accuracy on unlabeled target data as the fraction of examples with the score above the threshold. Interestingly, this threshold yields accurate estimates on a wide set of target distributions resulting from natural and synthetic shifts. Right: Efficacy of ATC over previously proposed approaches on our testbed with a post-hoc calibrated model. To obtain errors on the same scale, we rescale all errors with Average Confidence (AC) error. Lower estimation error is better. See Table 1 for exact numbers and comparison on various types of distribution shift. See Sec. 5 for details on our testbed.\n\nRecently, numerous methods have been proposed for this purpose (Deng \\& Zheng, 2021; Chen et al., 2021b; Jiang et al., 2021; Deng et al., 2021; Guillory et al., 2021). These methods either require calibration on the target domain to yield consistent estimates (Jiang et al., 2021; Guillory et al., 2021) or additional labeled data from several target domains to learn a linear regression function on a distributional distance that then predicts model performance (Deng et al., 2021; Deng \\& Zheng, 2021; Guillory et al., 2021). However, methods that require calibration on the target domain typically yield poor estimates since deep models trained and calibrated on source data are not, in general, calibrated on a (previously unseen) target domain (Ovadia et al., 2019). Besides, methods that leverage labeled data from target domains rely on the fact that unseen target domains exhibit strong linear correlation with seen target domains on the underlying distance measure and, hence, can be rendered ineffective when such target domains with labeled data are unavailable (in Sec. 5.1 we demonstrate such a failure on a real-world distribution shift problem). Therefore, throughout the paper, we assume access to labeled source data and only unlabeled data from target domain(s).\nIn this work, we first show that absent assumptions on the source classifier or the nature of the shift, no method of estimating accuracy will work generally (even in non-contrived settings). To estimate accuracy on target domain perfectly, we highlight that even given perfect knowledge of the labeled source distribution (i.e., $p_{s}(x, y)$ ) and unlabeled target distribution (i.e., $p_{t}(x)$ ), we need restrictions on the nature of the shift such that we can uniquely identify the target conditional $p_{t}(y \\mid x)$. Thus, in general, identifying the accuracy of the classifier is as hard as identifying the optimal predictor.\nSecond, motivated by the superiority of methods that use maximum softmax probability (or logit) of a model for Out-Of-Distribution (OOD) detection (Hendrycks \\& Gimpel, 2016; Hendrycks et al., 2019), we propose a simple method that leverages softmax probability to predict model performance. Our method, Average Thresholded Confidence (ATC), learns a threshold on a score (e.g., maximum confidence or negative entropy) of model confidence on validation source data and predicts target domain accuracy as the fraction of unlabeled target points that receive a score above that threshold. ATC selects a threshold on validation source data such that the fraction of source examples that receive the score above the threshold match the accuracy of those examples. Our primary contribution in ATC is the proposal of obtaining the threshold and observing its efficacy on (practical) accuracy estimation. Importantly, our work takes a step forward in positively answering the question raised in Deng \\& Zheng (2021); Deng et al. (2021) about a practical strategy to select a threshold that enables accuracy prediction with thresholded model confidence.",
            "images": [
                {
                    "id": "img-0.jpeg",
                    "top_left_x": 292,
                    "top_left_y": 217,
                    "bottom_right_x": 1405,
                    "bottom_right_y": 649,
                    "image_base64": "..."
                }
            ],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 3,
            "markdown": "ATC is simple to implement with existing frameworks, compatible with arbitrary model classes, and dominates other contemporary methods. Across several model architectures on a range of benchmark vision and language datasets, we verify that ATC outperforms prior methods by at least $2-4 \\times$ in predicting target accuracy on a variety of distribution shifts. In particular, we consider shifts due to common corruptions (e.g., ImageNet-C), natural distribution shifts due to dataset reproduction (e.g., ImageNet-v2, ImageNet-R), shifts due to novel subpopulations (e.g., BREEDS), and distribution shifts faced in the wild (e.g., WILDS).\n\nAs a starting point for theory development, we investigate ATC on a simple toy model that models distribution shift with varying proportions of the population with spurious features, as in Nagarajan et al. (2020). Finally, we note that although ATC achieves superior performance in our empirical evaluation, like all methods, it must fail (returns inconsistent estimates) on certain types of distribution shifts, per our impossibility result.\n\n# 2 PRIOR WORK \n\nOut-of-distribution detection. The main goal of OOD detection is to identify previously unseen examples, i.e., samples out of the support of training distribution. To accomplish this, modern methods utilize confidence or features learned by a deep network trained on some source data. Hendrycks \\& Gimpel (2016); Geifman \\& El-Yaniv (2017) used the confidence score of an (already) trained deep model to identify OOD points. Lakshminarayanan et al. (2016) use entropy of an ensemble model to evaluate prediction uncertainty on OOD points. To improve OOD detection with model confidence, Liang et al. (2017) propose to use temperature scaling and input perturbations. Jiang et al. (2018) propose to use scores based on the relative distance of the predicted class to the second class. Recently, residual flow-based methods were used to obtain a density model for OOD detection (Zhang et al., 2020). Ji et al. (2021) proposed a method based on subfunction error bounds to compute unreliability per sample. Refer to Ovadia et al. (2019); Ji et al. (2021) for an overview and comparison of methods for prediction uncertainty on OOD data.\n\nPredicting model generalization. Understanding generalization capabilities of overparameterized models on in-distribution data using conventional machine learning tools has been a focus of a long line of work; representative research includes Neyshabur et al. (2015; 2017); Neyshabur (2017); Neyshabur et al. (2018); Dziugaite \\& Roy (2017); Bartlett et al. (2017); Zhou et al. (2018); Long \\& Sedghi (2019); Nagarajan \\& Kolter (2019a). At a high level, this line of research bounds the generalization gap directly with complexity measures calculated on the trained model. However, these bounds typically remain numerically loose relative to the true generalization error (Zhang et al., 2016; Nagarajan \\& Kolter, 2019b). On the other hand, another line of research departs from complexitybased approaches to use unseen unlabeled data to predict in-distribution generalization (Platanios et al., 2016; 2017; Garg et al., 2021; Jiang et al., 2021).\n\nRelevant to our work are methods for predicting the error of a classifier on OOD data based on unlabeled data from the target (OOD) domain. These methods can be characterized into two broad categories: (i) Methods which explicitly predict correctness of the model on individual unlabeled points (Deng \\& Zheng, 2021; Jiang et al., 2021; Deng et al., 2021; Chen et al., 2021a); and (ii) Methods which directly obtain an estimate of error with unlabeled OOD data without making a point-wise prediction (Chen et al., 2021b; Guillory et al., 2021; Chuang et al., 2020).\nTo achieve a consistent estimate of the target accuracy, Jiang et al. (2021); Guillory et al. (2021) require calibration on target domain. However, these methods typically yield poor estimates as deep models trained and calibrated on some source data are seldom calibrated on previously unseen domains (Ovadia et al., 2019). Additionally, Deng \\& Zheng (2021); Guillory et al. (2021) derive model-based distribution statistics on unlabeled target set that correlate with the target accuracy and propose to use a subset of labeled target domains to learn a (linear) regression function that predicts model performance. However, there are two drawbacks with this approach: (i) the correlation of these distribution statistics can vary substantially as we consider different nature of shifts (refer to Sec. 5.1, where we empirically demonstrate this failure); (ii) even if there exists a (hypothetical) statistic with strong correlations, obtaining labeled target domains (even simulated ones) with strong correlations would require significant a priori knowledge about the nature of shift that, in general, might not be available before models are deployed in the wild. Nonetheless, in our work, we only assume access to labeled data from the source domain presuming no access to labeled target domains or information about how to simulate them.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 4,
            "markdown": "Moreover, unlike the parallel work of Deng et al. (2021), we do not focus on methods that alter the training on source data to aid accuracy prediction on the target data. Chen et al. (2021b) propose an importance re-weighting based approach that leverages (additional) information about the axis along which distribution is shifting in form of \"slicing functions\". In our work, we make comparisons with importance re-weighting baseline from Chen et al. (2021b) as we do not have any additional information about the axis along which the distribution is shifting.\n\n# 3 Problem Setup \n\nNotation. By $\\|\\cdot|$, and $\\langle\\cdot, \\cdot\\rangle$ we denote the Euclidean norm and inner product, respectively. For a vector $v \\in \\mathbb{R}^{d}$, we use $v_{j}$ to denote its $j^{\\text {th }}$ entry, and for an event $E$ we let $\\mathbb{I}[E]$ denote the binary indicator of the event.\nSuppose we have a multi-class classification problem with the input domain $\\mathcal{X} \\subseteq \\mathbb{R}^{d}$ and label space $\\mathcal{Y}=\\{1,2, \\ldots, k\\}$. For binary classification, we use $\\mathcal{Y}=\\{0,1\\}$. By $\\mathcal{D}^{\\mathcal{S}}$ and $\\mathcal{D}^{\\mathrm{T}}$, we denote source and target distribution over $\\mathcal{X} \\times \\mathcal{Y}$. For distributions $\\mathcal{D}^{\\mathcal{S}}$ and $\\mathcal{D}^{\\mathrm{T}}$, we define $p_{\\mathcal{S}}$ or $p_{\\mathrm{T}}$ as the corresponding probability density (or mass) functions. A dataset $S:=\\left\\{\\left(x_{i}, y_{i}\\right)\\right\\}_{i=1}^{n} \\sim\\left(\\mathcal{D}^{\\mathcal{S}}\\right)^{n}$ contains $n$ points sampled i.i.d. from $\\mathcal{D}^{\\mathcal{S}}$. Let $\\mathcal{F}$ be a class of hypotheses mapping $\\mathcal{X}$ to $\\Delta^{k-1}$ where $\\Delta^{k-1}$ is a simplex in $k$ dimensions. Given a classifier $f \\in \\mathcal{F}$ and datum $(x, y)$, we denote the $0-1$ error (i.e., classification error) on that point by $\\mathcal{E}(f(x), y):=\\mathbb{I}\\left[y \\notin \\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x)\\right]$. Given a model $f \\in \\mathcal{F}$, our goal in this work is to understand the performance of $f$ on $\\mathcal{D}^{\\mathrm{T}}$ without access to labeled data from $\\mathcal{D}^{\\mathrm{T}}$. Note that our goal is not to adapt the model to the target data. Concretely, we aim to predict accuracy of $f$ on $\\mathcal{D}^{\\mathrm{T}}$. Throughout this paper, we assume we have access to the following: (i) model $f$; (ii) previously-unseen (validation) data from $\\mathcal{D}^{\\mathcal{S}}$; and (iii) unlabeled data from target distribution $\\mathcal{D}^{\\mathrm{T}}$.\n\n### 3.1 Accuracy Estimation: Possibility and Impossibility Results\n\nFirst, we investigate the question of when it is possible to estimate the target accuracy of an arbitrary classifier, even given knowledge of the full source distribution $p_{s}(x, y)$ and target marginal $p_{t}(x)$. Absent assumptions on the nature of shift, estimating target accuracy is impossible. Even given access to $p_{s}(x, y)$ and $p_{t}(x)$, the problem is fundamentally unidentifiable because $p_{t}(y \\mid x)$ can shift arbitrarily. In the following proposition, we show that absent assumptions on the classifier $f$ (i.e., when $f$ can be any classifier in the space of all classifiers on $\\mathcal{X}$ ), we can estimate accuracy on the target data iff assumptions on the nature of the shift, together with $p_{s}(x, y)$ and $p_{t}(x)$, uniquely identify the (unknown) target conditional $p_{t}(y \\mid x)$. We relegate proofs from this section to App. A.\nProposition 1. Absent further assumptions, accuracy on the target is identifiable iff $p_{t}(y \\mid x)$ is uniquely identified given $p_{s}(x, y)$ and $p_{t}(x)$.\n\nProposition 1 states that we need enough constraints on nature of shift such that $p_{s}(x, y)$ and $p_{t}(x)$ identifies unique $p_{t}(y \\mid x)$. It also states that under some assumptions on the nature of the shift, we can hope to estimate the model's accuracy on target data. We will illustrate this on two common assumptions made in domain adaptation literature: (i) covariate shift (Heckman, 1977; Shimodaira, 2000) and (ii) label shift (Saerens et al., 2002; Zhang et al., 2013; Lipton et al., 2018). Under covariate shift assumption, that the target marginal support $\\operatorname{supp}\\left(p_{t}(x)\\right)$ is a subset of the source marginal support $\\operatorname{supp}\\left(p_{s}(x)\\right)$ and that the conditional distribution of labels given inputs does not change within support, i.e., $p_{s}(y \\mid x)=p_{t}(y \\mid x)$, which, trivially, identifies a unique target conditional $p_{t}(y \\mid x)$. Under label shift, the reverse holds, i.e., the class-conditional distribution does not change $\\left(p_{s}(x \\mid y)=p_{t}(x \\mid y)\\right)$ and, again, information about $p_{t}(x)$ uniquely determines the target conditional $p_{t}(y \\mid x)$ (Lipton et al., 2018; Garg et al., 2020). In these settings, one can estimate an arbitrary classifier's accuracy on the target domain either by using importance re-weighting with the ratio $p_{t}(x) / p_{s}(x)$ in case of covariate shift or by using importance re-weighting with the ratio $p_{t}(y) / p_{s}(y)$ in case of label shift. While importance ratios in the former case can be obtained directly when $p_{t}(x)$ and $p_{s}(x)$ are known, the importance ratios in the latter case can be obtained by using techniques from Saerens et al. (2002); Lipton et al. (2018); Azizzadenesheli et al. (2019); Alexandari et al. (2019). In App. B, we explore accuracy estimation in the setting of these shifts and present extensions to generalized notions of label shift (Tachet des Combes et al., 2020) and covariate shift (Rojas-Carulla et al., 2018).\n\nAs a corollary of Proposition 1, we now present a simple impossibility result, demonstrating that no single method can work for all families of distribution shift.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 5,
            "markdown": "Corollary 1. Absent assumptions on the classifier $f$, no method of estimating accuracy will work in all scenarios, i.e., for different nature of distribution shifts.\n\nIntuitively, this result states that every method of estimating accuracy on target data is tied up with some assumption on the nature of the shift and might not be useful for estimating accuracy under a different assumption on the nature of the shift. For illustration, consider a setting where we have access to distribution $p_{s}(x, y)$ and $p_{t}(x)$. Additionally, assume that the distribution can shift only due to covariate shift or label shift without any knowledge about which one. Then Corollary 1 says that it is impossible to have a single method that will simultaneously for both label shift and covariate shift as in the following example (we spell out the details in App. A):\n\nExample 1. Assume binary classification with $p_{s}(x)=\\alpha \\cdot \\phi\\left(\\mu_{1}\\right)+(1-\\alpha) \\cdot \\phi\\left(\\mu_{2}\\right)$, $p_{s}(x \\mid y=0)=\\phi\\left(\\mu_{1}\\right), p_{s}(x \\mid y=1)=\\phi\\left(\\mu_{2}\\right)$, and $p_{t}(x)=\\beta \\cdot \\phi\\left(\\mu_{1}\\right)+(1-\\beta) \\cdot \\phi\\left(\\mu_{2}\\right)$ where $\\phi(\\mu)=\\mathcal{N}(\\mu, 1), \\alpha, \\beta \\in(0,1)$, and $\\alpha \\neq \\beta$. Error of a classifier $f$ on target data is given by $\\mathcal{E}_{1}=\\mathbb{E}_{(x, y) \\sim p_{s}(x, y)}\\left[\\frac{p_{t}(x)}{p_{s}(x)} \\mathbb{I}[f(x) \\neq y]\\right]$ under covariate shift and by $\\mathcal{E}_{2}=$ $\\mathbb{E}_{(x, y) \\sim p_{s}(x, y)}\\left[\\left(\\frac{\\beta}{\\alpha} \\mathbb{I}[y=0]+\\frac{1-\\beta}{1-\\alpha} \\mathbb{I}[y=1]\\right) \\mathbb{I}[f(x) \\neq y]\\right]$ under label shift. In App. A, we show that $\\mathcal{E}_{1} \\neq \\mathcal{E}_{2}$ for all $f$. Thus, given access to $p_{s}(x, y)$, and $p_{t}(x)$, any method that consistently estimates error of a classifer under covariate shift will give an incorrect estimate of error under label shift and vice-versa. The reason is that the same $p_{t}(x)$ and $p_{s}(x, y)$ can correspond to error $\\mathcal{E}_{1}$ (under covariate shift) or error $\\mathcal{E}_{2}$ (under label shift) and determining which scenario one faces requires further assumptions on the nature of shift.\n\n# 4 Predicting accuracy with Average Thresholded CONFIDENCE \n\nIn this section, we present our method ATC that leverages a black box classifier $f$ and (labeled) validation source data to predict accuracy on target domain given access to unlabeled target data. Throughout the discussion, we assume that the classifier $f$ is fixed.\nBefore presenting our method, we introduce some terminology. Define a score function $s: \\Delta^{k-1} \\rightarrow$ $\\mathbb{R}$ that takes in the softmax prediction of the function $f$ and outputs a scalar. We want a score function such that if the score function takes a high value at a datum $(x, y)$ then $f$ is likely to be correct. In this work, we explore two such score functions: (i) Maximum confidence, i.e., $s(f(x))=\\max _{j \\in \\mathcal{Y}} f_{j}(x)$; and (ii) Negative Entropy, i.e., $s(f(x))=\\sum_{j} f_{j}(x) \\log \\left(f_{j}(x)\\right)$. Our method identifies a threshold $t$ on source data $\\mathcal{D}^{\\mathbb{S}}$ such that the expected number of points that obtain a score less than $t$ match the error of $f$ on $\\mathcal{D}^{\\mathbb{S}}$, i.e.,\n\n$$\n\\mathbb{E}_{x \\sim \\mathcal{D}^{\\mathbb{S}}}[\\mathbb{I}[s(f(x))<t]]=\\mathbb{E}_{(x, y) \\sim \\mathcal{D}^{\\mathbb{S}}}\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x) \\neq y\\right]\\right]\n$$\n\nand then our error estimate $\\mathrm{ATC}_{\\mathcal{D}^{\\mathrm{T}}}(s)$ on the target domain $\\mathcal{D}^{\\mathrm{T}}$ is given by the expected number of target points that obtain a score less than $t$, i.e.,\n\n$$\n\\operatorname{ATC}_{\\mathcal{D}^{\\mathrm{T}}}(s)=\\mathbb{E}_{x \\sim \\mathcal{D}^{\\mathrm{T}}}[\\mathbb{I}[s(f(x))<t]]\n$$\n\nIn short, in (1), ATC selects a threshold on the score function such that the error in the source domain matches the expected number of points that receive a score below $t$ and in (2), ATC predicts error on the target domain as the fraction of unlabeled points that obtain a score below that threshold $t$. Note that, in principle, there exists a different threshold $t^{\\prime}$ on the target distribution $\\mathcal{D}^{\\mathrm{T}}$ such that (1) is satisfied on $\\mathcal{D}^{\\mathrm{T}}$. However, in our experiments, the same threshold performs remarkably well. The main empirical contribution of our work is to show that the threshold obtained with (1) might be used effectively in condunction with modern deep networks in a wide range of settings to estimate error on the target data. In practice, to obtain the threshold with ATC, we minimize the difference between the expression on two sides of (1) using finite samples. In the next section, we show that ATC precisely predicts accuracy on the OOD data on the desired line $y=x$. In App. C, we discuss an alternate interpretation of the method and make connections with OOD detection methods.\n\n## 5 EXPERIMENTS\n\nWe now empirical evaluate ATC and compare it with existing methods. In each of our main experiment, keeping the underlying model fixed, we vary target datasets and make a prediction",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 6,
            "markdown": "![img-1.jpeg](img-1.jpeg)\n\nFigure 2: Scatter plot of predicted accuracy versus (true) OOD accuracy. Each point denotes a different OOD dataset, all evaluated with the same DenseNet121 model. We only plot the best three methods. With ATC (ours), we refer to ATC-NE. We observe that ATC significantly outperforms other methods and with ATC, we recover the desired line $y=x$ with a robust linear fit. Aggregated estimation error in Table 1 and plots for other datasets and architectures in App. H.\nof the target accuracy with various methods given access to only unlabeled data from the target. Unless noted otherwise, all models are trained only on samples from the source distribution with the main exception of pre-training on a different distribution. We use labeled examples from the target distribution to only obtain true error estimates.\n\nDatasets. First, we consider synthetic shifts induced due to different visual corruptions (e.g., shot noise, motion blur etc.) under ImageNet-C (Hendrycks \\& Dietterich, 2019). Next, we consider natural shifts due to differences in the data collection process of ImageNet (Russakovsky et al., 2015), e.g, ImageNetv2 (Recht et al., 2019). We also consider images with artistic renditions of object classes, i.e., ImageNet-R (Hendrycks et al., 2021) and ImageNet-Sketch (Wang et al., 2019). Note that renditions dataset only contains a subset 200 classes from ImageNet. To include renditions dataset in our testbed, we include results on ImageNet restricted to these 200 classes (which we call ImageNet-200) along with full ImageNet.\n\nSecond, we consider BREEDs (Santurkar et al., 2020) to assess robustness to subpopulation shifts, in particular, to understand how accuracy estimation methods behave when novel subpopulations not observed during training are introduced. BREEDS leverages class hierarchy in ImageNet to create 4 datasets Entity-13, Entity-30, Living-17, Non-Living-26. We focus on natural and synthetic shifts as in ImageNet on same and different subpopulations in BREEDs. Third, from Wilds (Koh et al., 2021) benchmark, we consider FMoW-WILDS (Christie et al., 2018), RxRx1-WILDS (Taylor et al., 2019), Amazon-WILDS (Ni et al., 2019), CivilComments-WILDS (Borkan et al., 2019) to consider distribution shifts faced in the wild.\n\nFinally, similar to ImageNet, we consider (i) synthetic shifts (CIFAR-10-C) due to common corruptions; and (ii) natural shift (i.e., CIFARv2 (Recht et al., 2018)) on CIFAR-10 (Krizhevsky \\& Hinton, 2009). On CIFAR-100, we just have synthetic shifts due to common corruptions. For completeness, we also consider natural shifts on MNIST (LeCun et al., 1998) as in the prior work (Deng \\& Zheng, 2021). We use three real shifted datasets, i.e., USPS (Hull, 1994), SVHN (Netzer et al., 2011) and QMNIST (Yadav \\& Bottou, 2019). We give a detailed overview of our setup in App. F.\nArchitectures and Evaluation. For ImageNet, BREEDs, CIFAR, FMoW-WILDS, RxRx1-WILDS datasets, we use DenseNet121 (Huang et al., 2017) and ResNet50 (He et al., 2016) architectures. For Amazon-WILDS and CivilComments-WILDS, we fine-tune a DistilBERT-base-uncased (Sanh et al., 2019) model. For MNIST, we train a fully connected multilayer perceptron. We use standard training with benchmarked hyperparameters. To compare methods, we report average absolute difference between the true accuracy on the target data and the estimated accuracy on the same unlabeled examples. We refer to this metric as Mean Absolute estimation Error (MAE). Along with MAE, we also show scatter plots to visualize performance at individual target sets. Refer to App. G for additional details on the setup.\nMethods With ATC-NE, we denote ATC with negative entropy score function and with ATC-MC, we denote ATC with maximum confidence score function. For all methods, we implement post-hoc calibration on validation source data with Temperature Scaling (TS; Guo et al. (2017)). Below we briefly discuss baselines methods compared in our work and relegate details to App. E.",
            "images": [
                {
                    "id": "img-1.jpeg",
                    "top_left_x": 294,
                    "top_left_y": 176,
                    "bottom_right_x": 1390,
                    "bottom_right_y": 561,
                    "image_base64": "..."
                }
            ],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 7,
            "markdown": "| Dataset | Shift | IM |  | AC |  | DOC |  | GDE | ATC-MC (Ours) |  | ATC-NE (Ours) |  |\n| :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |\n|  |  | Pre T | Post T | Pre T | Post T | Pre T | Post T | Post T | Pre T | Post T | Pre T | Post T |\n| CIFAR10 | Natural | 6.60 | 5.74 | 9.88 | 6.89 | 7.25 | 6.07 | 4.77 | 3.21 | 3.02 | 2.99 | 2.85 |\n|  | Synthetic | 12.33 | 10.20 | 16.50 | 11.91 | 13.87 | 11.08 | 6.55 | 4.65 | 4.25 | 4.21 | 3.87 |\n| CIFAR100 | Synthetic | 13.69 | 11.51 | 23.61 | 13.10 | 14.60 | 10.14 | 9.85 | 5.50 | 4.75 | 4.72 | 4.94 |\n| ImageNet200 | Natural | 12.37 | 8.19 | 22.07 | 8.61 | 15.17 | 7.81 | 5.13 | 4.37 | 2.04 | 3.79 | 1.45 |\n|  | Synthetic | 19.86 | 12.94 | 32.44 | 13.35 | 25.02 | 12.38 | 5.41 | 5.93 | 3.09 | 5.00 | 2.68 |\n| ImageNet | Natural | 7.77 | 6.50 | 18.13 | 6.02 | 8.13 | 5.76 | 6.23 | 3.88 | 2.17 | 2.06 | 0.80 |\n|  | Synthetic | 13.39 | 10.12 | 24.62 | 8.51 | 13.55 | 7.90 | 6.32 | 3.34 | 2.53 | 2.61 | 4.89 |\n| FMoW-WILDS | Natural | 5.53 | 4.31 | 33.53 | 12.84 | 5.94 | 4.45 | 5.74 | 3.06 | 2.70 | 3.02 | 2.72 |\n| RxRx1-WILDS | Natural | 5.80 | 5.72 | 7.90 | 4.84 | 5.98 | 5.98 | 6.03 | 4.66 | 4.56 | 4.41 | 4.47 |\n| Amazon-WILDS | Natural | 2.40 | 2.29 | 8.01 | 2.38 | 2.40 | 2.28 | 17.87 | 1.65 | 1.62 | 1.60 | 1.50 |\n| CivilCom.-WILDS | Natural | 12.64 | 10.80 | 16.76 | 11.03 | 13.31 | 10.99 | 16.65 | 7.14 |  |  |  |\n| MNIST | Natural | 18.48 | 15.99 | 21.17 | 14.81 | 20.19 | 14.56 | 24.42 | 5.02 | 2.40 | 3.14 | 3.50 |\n| EntitY-13 | Same | 16.23 | 11.14 | 24.97 | 10.88 | 19.08 | 10.47 | 10.71 | 5.39 | 3.88 | 4.58 | 4.19 |\n|  | Novel | 28.53 | 22.02 | 38.33 | 21.64 | 32.43 | 21.22 | 20.61 | 13.58 | 10.28 | 12.25 | 6.63 |\n| EntitY-30 | Same | 18.59 | 14.46 | 28.82 | 14.30 | 21.63 | 13.46 | 12.92 | 9.12 | 7.75 | 8.15 | 7.64 |\n|  | Novel | 32.34 | 26.85 | 44.02 | 26.27 | 36.82 | 25.42 | 23.16 | 17.75 | 14.30 | 15.60 | 10.57 |\n| NONLIVING-26 | Same | 18.66 | 17.17 | 26.39 | 16.14 | 19.86 | 15.58 | 16.63 | 10.87 | 10.24 | 10.07 | 10.26 |\n|  | Novel | 33.43 | 31.53 | 41.66 | 29.87 | 35.13 | 29.31 | 29.56 | 21.70 | 20.12 | 19.08 | 18.26 |\n| LIVING-17 | Same | 12.63 | 11.05 | 18.32 | 10.46 | 14.43 | 10.14 | 9.87 | 4.57 | 3.95 | 3.81 | 4.21 |\n|  | Novel | 29.03 | 26.96 | 35.67 | 26.11 | 31.73 | 25.73 | 23.53 | 16.15 | 14.49 | 12.97 | 11.39 |\n\nTable 1: Mean Absolute estimation Error (MAE) results for different datasets in our setup grouped by the nature of shift. 'Same' refers to same subpopulation shifts and 'Novel' refers novel subpopulation shifts. We include details about the target sets considered in each shift in Table 2. Post T denotes use of TS calibration on source. Across all datasets, we observe that ATC achieves superior performance (lower MAE is better). For language datasets, we use DistilBERT-base-uncased, for vision dataset we report results with DenseNet model with the exception of MNIST where we use FCN. We include results on other architectures in App. H. For GDE post T and pre T estimates match since TS doesn\u2019t alter the argmax prediction. Results reported by aggregating MAE numbers over 4 different seeds. We include results with standard deviation values in Table 3.\n\nAverage Confidence (AC). Error is estimated as the expected value of the maximum softmax confidence on the target data, i.e, $\\mathrm{AC}_{\\mathcal{D}^{\\dagger}}=\\mathbb{E}_{x \\sim \\mathcal{D}^{\\dagger}}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}(x)\\right]$.\nDifference Of Confidence (DOC). We estimate error on target by subtracting difference of confidences on source and target (as a surrogate to distributional distance Guillory et al. (2021)) from the error on source distribution, i.e, $\\mathrm{DOC}_{\\mathcal{D}^{\\dagger}}=\\mathbb{E}_{x \\sim \\mathcal{D}^{\\delta}}\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x) \\neq y\\right]\\right]+\\mathbb{E}_{x \\sim \\mathcal{D}^{\\dagger}}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}(x)\\right]-$ $\\mathbb{E}_{x \\sim \\mathcal{D}^{\\delta}}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}(x)\\right]$. This is referred to as DOC-Feat in (Guillory et al., 2021).\nImportance re-weighting (IM). We estimate the error of the classifier with importance re-weighting of $0-1$ error in the pushforward space of the classifier. This corresponds to MANDOLIN using one slice based on the underlying classifier confidence Chen et al. (2021b).\n\nGeneralized Disagreement Equality (GDE). Error is estimated as the expected disagreement of two models (trained on the same training set but with different randomization) on target data (Jiang et al., 2021), i.e., $\\operatorname{GDE}_{\\mathcal{D}^{\\dagger}}=\\mathbb{E}_{x \\sim \\mathcal{D}^{\\dagger}}\\left[\\mathbb{I}\\left[f(x) \\neq f^{\\prime}(x)\\right]\\right]$ where $f$ and $f^{\\prime}$ are the two models. Note that GDE requires two models trained independently, doubling the computational overhead while training.\n\n### 5.1 RESULTS\n\nIn Table 1, we report MAE results aggregated by the nature of the shift in our testbed. In Fig. 2 and Fig. 1(right), we show scatter plots for predicted accuracy versus OOD accuracy on several datasets. We include scatter plots for all datasets and parallel results with other architectures in App. H. In App. H.1, we also perform ablations on CIFAR using a pre-trained model and observe that pre-training doesn't change the efficacy of ATC.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 8,
            "markdown": "![img-2.jpeg](img-2.jpeg)\n\nFigure 3: Left: Predicted accuracy with DOC on Living17 BreEds dataset. We observe a substantial gap in the linear fit of same and different subpopulations highlighting poor correlation. Middle: After fitting a robust linear model for DOC on same subpopulation, we show predicted accuracy on different subpopulations with fine-tuned DOC (i.e., $\\operatorname{DOC}(\\mathrm{w} / \\mathrm{fit})$ ) and compare with ATC without any regression model, i.e., ATC (w/o fit). While observe substantial improvements in MAE from 24.41 with DOC (w/o fit) to 13.26 with DOC (w/ fit), ATC (w/o fit) continues to outperform even DOC (w/ fit) with MAE 10.22. We show parallel results with other BREEDS datasets in App. H.2. Right : Empirical validation of our toy model. We show that ATC perfectly estimates target performance as we vary the degree of spurious correlation in target. ' $\\times$ ' represents accuracy on source.\n\nWe predict accuracy on the target data before and after calibration with TS. First, we observe that both ATC-NE and ATC-MC (even without TS) obtain significantly lower MAE when compared with other methods (even with TS). Note that with TS we observe substantial improvements in MAE for all methods. Overall, ATC-NE (with TS) typically achieves the smallest MAE improving by more than $2 \\times$ on CIFAR and by $3-4 \\times$ on ImageNet over GDE (the next best alternative to ATC). Alongside, we also observe that a linear fit with robust regression (Siegel, 1982) on the scatter plot recovers a line close to $x=y$ for ATC-NE with TS while the line is far away from $x=y$ for other methods (Fig. 2 and Fig. 1(right)). Remarkably, MAE is in the range of $0.4-5.8$ with ATC for CIFAR, ImageNet, MNIST, and Wilds. However, MAE is much higher on BREEDS benchmark with novel subpopulations. While we observe a small MAE (i.e., comparable to our observations on other datasets) on BREEDS with natural and synthetic shifts from the same sub-population, MAE on shifts with novel population is significantly higher with all methods. Note that even on novel populations, ATC continues to dominate all other methods across all datasets in BREEDS.\nAdditionally, for different subpopulations in BREEDS setup, we observe a poor linear correlation of the estimated performance with the actual performance as shown in Fig. 3 (left)(we notice a similar gap in the linear fit for all other methods). Hence in such a setting, we would expect methods that fine-tune a regression model on labeled target examples from shifts with one subpopulation will perform poorly on shifts with different subpopulations. Corroborating this intuition, next, we show that even after fitting a regression model for DOC on natural and synthetic shifts with source subpopulations, ATC without regression model continues to outperform DOC with regression model on shifts with novel subpopulation.\n\nFitting a regression model on BREEDS with DOC. Using label target data from natural and synthetic shifts for the same subpopulation (same as source), we fit a robust linear regression model (Siegel, 1982) to fine-tune DOC as in Guillory et al. (2021). We then evaluate the fine-tuned DOC (i.e., DOC with linear model) on natural and synthetic shifts from novel subpopulations on BREEDS benchmark. Although we observe significant improvements in the performance of finetuned DOC when compared with DOC (without any fine-tuning), ATC without any regression model continues to perform better (or similar) to that of fine-tuned DOC on novel subpopulations (Fig. 3 (middle)). Refer to App. H. 2 for details and Table 5 for MAE on BREEDS with regression model.\n\n## 6 InVEStigating ATC on Toy Model\n\nIn this section, we propose and analyze a simple theoretical model that distills empirical phenomena from the previous section and highlights efficacy of ATC. Here, our aim is not to obtain a general model that captures complicated real distributions on high dimensional input space as the images in ImageNet. Instead to further our understanding, we focus on an easy-to-learn binary classification task from Nagarajan et al. (2020) with linear classifiers, that is rich enough to exhibit some of the same phenomena as with deep networks on real data distributions.",
            "images": [
                {
                    "id": "img-2.jpeg",
                    "top_left_x": 292,
                    "top_left_y": 202,
                    "bottom_right_x": 1390,
                    "bottom_right_y": 488,
                    "image_base64": "..."
                }
            ],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 9,
            "markdown": "Consider a easy-to-learn binary classification problem with two features $x=\\left[x_{\\text {inv }}, x_{\\text {sp }}\\right] \\in \\mathbb{R}^{2}$ where $x_{\\text {inv }}$ is fully predictive invariant feature with a margin $\\gamma>0$ and $x_{\\text {sp }} \\in\\{-1,1\\}$ is a spurious feature (i.e., a feature that is correlated but not predictive of the true label). Conditional on $y$, the distribution over $x_{\\text {inv }}$ is given as follows: $x_{\\text {inv }} \\mid(y=1) \\sim U[\\gamma, c]$ and $x_{\\text {inv }} \\mid(y=0) \\sim U[-c,-\\gamma]$, where $c$ is a fixed constant greater than $\\gamma$. For simplicity, we assume that label distribution on source is uniform on $\\{-1,1\\}$. $x_{\\text {sp }}$ is distributed such that $P_{x}\\left[x_{\\text {sp }} \\cdot(2 y-1)>0\\right]=p_{\\text {sp }}$, where $p_{\\text {sp }} \\in(0.5,1.0)$ controls the degree of spurious correlation. To model distribution shift, we simulate target data with different degree of spurious correlation, i.e., in target distribution $P_{t}\\left[x_{\\text {sp }} \\cdot(2 y-1)>0\\right]=p_{\\text {sp }}^{\\prime} \\in[0,1]$. Note that here we do not consider shifts in the label distribution but our result extends to arbitrary shifts in the label distribution as well.\n\nIn this setup, we examine linear sigmoid classifiers of the form $f(x)=\\left[\\frac{1}{1+e^{w^{T} x}}, \\frac{e^{w^{T} x}}{1+e^{w^{T} x}}\\right]$ where $w=\\left[w_{\\text {inv }}, w_{\\text {sp }}\\right] \\in \\mathbb{R}^{2}$. While there exists a linear classifier with $w=[1,0]$ that correctly classifies all the points with a margin $\\gamma$, Nagarajan et al. (2020) demonstrated that a linear classifier will typically have a dependency on the spurious feature, i.e., $w_{\\text {sp }} \\neq 0$. They show that due to geometric skews, despite having positive dependencies on the invariant feature, a max-margin classifier trained on finite samples relies on the spurious feature. Refer to App. D for more details on these skews. In our work, we show that given a linear classifier that relies on the spurious feature and achieves a non-trivial performance on the source (i.e., $w_{\\text {inv }}>0$ ), ATC with maximum confidence score function consistently estimates the accuracy on the target distribution.\nTheorem 1 (Informal). Given any classifier with $w_{\\text {inv }}>0$ in the above setting, the threshold obtained in (1) together with ATC as in (2) with maximum confidence score function obtains a consistent estimate of the target accuracy.\n\nConsider a classifier that depends positively on the spurious feature (i.e., $w_{\\text {sp }}>0$ ). Then as the spurious correlation decreases in the target data, the classifier accuracy on the target will drop and vice-versa if the spurious correlation increases on the target data. Theorem 1 shows that the threshold identified with ATC as in (1) remains invariant as the distribution shifts and hence ATC as in (2) will correctly estimate the accuracy with shifting distributions. Next, we illustrate Theorem 1 by simulating the setup empirically. First we pick a arbitrary classifier (which can also be obtained by training on source samples), tune the threshold on hold-out source examples and predict accuracy with different methods as we shift the distribution by varying the degree of spurious correlation.\nEmpirical validation and comparison with other methods. Fig. 3(right) shows that as the degree of spurious correlation varies, our method accurately estimates the target performance where all other methods fail to accurately estimate the target performance. Understandably, due to poor calibration of the sigmoid linear classifier AC, DOC and GDE fail. While in principle IM can perfectly estimate the accuracy on target in this case, we observe that it is highly sensitive to the number bins and choice of histogram binning (i.e., uniform mass or equal width binning). We elaborate more on this in App. D.\nBiased estimation with ATC. Now we discuss changes in the above setup where ATC yields inconsistent estimates. We assumed that both in source and target $x_{\\text {inv }} \\mid y=1$ is uniform between $[\\gamma, c]$ and $x \\mid y=-1$ is uniform between $[-c,-\\gamma]$. Shifting the support of target class conditional $p_{t}\\left(x_{\\text {inv }} \\mid y\\right)$ may introduce a bias in ATC estimates, e.g., shrinking the support to $c_{1}(<c)$ (while maintaining uniform distribution) in the target will lead to an over-estimation of the target performance with ATC. In App. D.1, we elaborate on this failure and present a general (but less interpretable) classifier dependent distribution shift condition where ATC is guaranteed to yield consistent estimates.\n\n# 7 CONCLUSION AND FUTURE WORK \n\nIn this work, we proposed ATC, a simple method for estimating target domain accuracy based on unlabeled target (and labeled source data). ATC achieves remarkably low estimation error on several synthetic and natural shift benchmarks in our experiments. Notably, our work draws inspiration from recent state-of-the-art methods that use softmax confidences below a certain threshold for OOD detection (Hendrycks \\& Gimpel, 2016; Hendrycks et al., 2019) and takes a step forward in answering questions raised in Deng \\& Zheng (2021) about the practicality of threshold based methods.\nOur distribution shift toy model justifies ATC on an easy-to-learn binary classification task. In our experiments, we also observe that calibration significantly improves estimation with ATC. Since in binary classification, post hoc calibration with TS does not change the effective threshold, in future work, we hope to extend our theoretical model to multi-class classification to understand the efficacy",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 10,
            "markdown": "of calibration. Our theory establishes that a classifier's accuracy is not, in general identified, from labeled source and unlabeled target data alone, absent considerable additional constraints on the target conditional $p_{t}(y \\mid x)$. In light of this finding, we also hope to extend our understanding beyond the simple theoretical toy model to characterize broader sets of conditions under which ATC might be guaranteed to obtain consistent estimates. Finally, we should note that while ATC outperforms previous approaches, it still suffers from large estimation error on datasets with novel populations, e.g., BREEDS. We hope that our findings can lay the groundwork for future work for improving accuracy estimation on such datasets.\n\nReproducibility Statement Our code to reproduce all the results is available at https:// github.com/saurabhgarg1996/ATC_code. We have been careful to ensure that our results are reproducible. We have stored all models and logged all hyperparameters and seeds to facilitate reproducibility. Note that throughout our work, we do not perform any hyperparameter tuning, instead, using benchmarked hyperparameters and training procedures to make our results easy to reproduce. While, we have not released code yet, the appendix provides all the necessary details to replicate our experiments and results.\n\n# ACKNOWLEDGEMENT \n\nAuthors would like to thank Ariel Kleiner and Sammy Jerome as the problem formulation and motivation of this paper was highly influenced by initial discussions with them.\n\n## REFERENCES\n\nAmr Alexandari, Anshul Kundaje, and Avanti Shrikumar. Adapting to label shift with bias-corrected calibration. In arXiv preprint arXiv:1901.06852, 2019.\n\nKamyar Azizzadenesheli, Anqi Liu, Fanny Yang, and Animashree Anandkumar. Regularized learning for domain adaptation under label shifts. In International Conference on Learning Representations (ICLR), 2019.\n\nPeter L Bartlett, Dylan J Foster, and Matus J Telgarsky. Spectrally-normalized margin bounds for neural networks. In Advances in neural information processing systems, pp. 6240-6249, 2017.\n\nShai Ben-David, Tyler Lu, Teresa Luu, and D\u00e1vid P\u00e1l. Impossibility Theorems for Domain Adaptation. In International Conference on Artificial Intelligence and Statistics (AISTATS), 2010.\n\nDaniel Borkan, Lucas Dixon, Jeffrey Sorensen, Nithum Thain, and Lucy Vasserman. Nuanced metrics for measuring unintended bias with real data for text classification. In Companion Proceedings of The 2019 World Wide Web Conference, 2019.\n\nJiefeng Chen, Frederick Liu, Besim Avci, Xi Wu, Yingyu Liang, and Somesh Jha. Detecting errors and estimating accuracy on unlabeled data with self-training ensembles. Advances in Neural Information Processing Systems, 34:14980-14992, 2021a.\n\nMayee Chen, Karan Goel, Nimit S Sohoni, Fait Poms, Kayvon Fatahalian, and Christopher R\u00e9. Mandoline: Model evaluation under distribution shift. In International Conference on Machine Learning, pp. 1617-1629. PMLR, 2021b.\n\nGordon Christie, Neil Fendley, James Wilson, and Ryan Mukherjee. Functional map of the world. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition, 2018.\n\nChing-Yao Chuang, Antonio Torralba, and Stefanie Jegelka. Estimating generalization under distribution shifts via domain-invariant representations. arXiv preprint arXiv:2007.03511, 2020.\n\nWeijian Deng and Liang Zheng. Are labels always necessary for classifier accuracy evaluation? In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition, pp. $15069-15078,2021$.\n\nWeijian Deng, Stephen Gould, and Liang Zheng. What does rotation prediction tell us about classifier accuracy under varying testing environments? arXiv preprint arXiv:2106.05961, 2021.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 11,
            "markdown": "Gintare Karolina Dziugaite and Daniel M Roy. Computing nonvacuous generalization bounds for deep (stochastic) neural networks with many more parameters than training data. arXiv preprint arXiv:1703.11008, 2017.\n\nSaurabh Garg, Yifan Wu, Sivaraman Balakrishnan, and Zachary C Lipton. A unified view of label shift estimation. arXiv preprint arXiv:2003.07554, 2020.\n\nSaurabh Garg, Sivaraman Balakrishnan, J Zico Kolter, and Zachary C Lipton. Ratt: Leveraging unlabeled data to guarantee generalization. arXiv preprint arXiv:2105.00303, 2021.\n\nYonatan Geifman and Ran El-Yaniv. Selective classification for deep neural networks. arXiv preprint arXiv:1705.08500, 2017.\n\nDevin Guillory, Vaishaal Shankar, Sayna Ebrahimi, Trevor Darrell, and Ludwig Schmidt. Predicting with confidence on unseen distributions. arXiv preprint arXiv:2107.03315, 2021.\n\nChuan Guo, Geoff Pleiss, Yu Sun, and Kilian Q Weinberger. On calibration of modern neural networks. In International Conference on Machine Learning (ICML), 2017.\n\nKaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun. Deep Residual Learning for Image Recognition. In Computer Vision and Pattern Recognition (CVPR), 2016.\n\nJames J Heckman. Sample Selection Bias as a Specification Error (With an Application to the Estimation of Labor Supply Functions), 1977.\n\nDan Hendrycks and Thomas Dietterich. Benchmarking neural network robustness to common corruptions and perturbations. arXiv preprint arXiv:1903.12261, 2019.\n\nDan Hendrycks and Kevin Gimpel. A baseline for detecting misclassified and out-of-distribution examples in neural networks. arXiv preprint arXiv:1610.02136, 2016.\n\nDan Hendrycks, Steven Basart, Mantas Mazeika, Mohammadreza Mostajabi, Jacob Steinhardt, and Dawn Song. Scaling out-of-distribution detection for real-world settings. arXiv preprint arXiv:1911.11132, 2019.\n\nDan Hendrycks, Steven Basart, Norman Mu, Saurav Kadavath, Frank Wang, Evan Dorundo, Rahul Desai, Tyler Zhu, Samyak Parajuli, Mike Guo, Dawn Song, Jacob Steinhardt, and Justin Gilmer. The many faces of robustness: A critical analysis of out-of-distribution generalization. ICCV, 2021.\n\nGao Huang, Zhuang Liu, Laurens Van Der Maaten, and Kilian Q Weinberger. Densely connected convolutional networks. In Proceedings of the IEEE conference on computer vision and pattern recognition, pp. 4700-4708, 2017.\n\nJonathan J. Hull. A database for handwritten text recognition research. IEEE Transactions on pattern analysis and machine intelligence, 16(5):550-554, 1994.\n\nXu Ji, Razvan Pascanu, Devon Hjelm, Andrea Vedaldi, Balaji Lakshminarayanan, and Yoshua Bengio. Predicting unreliable predictions by shattering a neural network. arXiv preprint arXiv:2106.08365, 2021.\n\nHeinrich Jiang, Been Kim, Melody Y Guan, and Maya R Gupta. To trust or not to trust a classifier. In NeurIPS, pp. 5546-5557, 2018.\n\nYiding Jiang, Vaishnavh Nagarajan, Christina Baek, and J Zico Kolter. Assessing generalization of sgd via disagreement. arXiv preprint arXiv:2106.13799, 2021.\n\nDiederik P Kingma and Jimmy Ba. Adam: A Method for Stochastic Optimization. arXiv Preprint arXiv:1412.6980, 2014.\n\nPang Wei Koh, Shiori Sagawa, Henrik Marklund, Sang Michael Xie, Marvin Zhang, Akshay Balsubramani, Weihua Hu, Michihiro Yasunaga, Richard Lanas Phillips, Irena Gao, Tony Lee, Etienne David, Ian Stavness, Wei Guo, Berton A. Earnshaw, Imran S. Haque, Sara Beery, Jure Leskovec, Anshul Kundaje, Emma Pierson, Sergey Levine, Chelsea Finn, and Percy Liang. WILDS: A benchmark of in-the-wild distribution shifts. In International Conference on Machine Learning (ICML), 2021.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 12,
            "markdown": "Alex Krizhevsky and Geoffrey Hinton. Learning Multiple Layers of Features from Tiny Images. Technical report, Citeseer, 2009.\n\nBalaji Lakshminarayanan, Alexander Pritzel, and Charles Blundell. Simple and scalable predictive uncertainty estimation using deep ensembles. arXiv preprint arXiv:1612.01474, 2016.\n\nYann LeCun, L\u00e9on Bottou, Yoshua Bengio, and Patrick Haffner. Gradient-Based Learning Applied to Document Recognition. Proceedings of the IEEE, 86, 1998.\n\nShiyu Liang, Yixuan Li, and Rayadurgam Srikant. Enhancing the reliability of out-of-distribution image detection in neural networks. arXiv preprint arXiv:1706.02690, 2017.\n\nZachary C Lipton, Yu-Xiang Wang, and Alex Smola. Detecting and Correcting for Label Shift with Black Box Predictors. In International Conference on Machine Learning (ICML), 2018.\n\nPhilip M Long and Hanie Sedghi. Generalization bounds for deep convolutional neural networks. arXiv preprint arXiv:1905.12600, 2019.\n\nIlya Loshchilov and Frank Hutter. Decoupled weight decay regularization. arXiv preprint arXiv:1711.05101, 2017.\n\nVaishnavh Nagarajan and J Zico Kolter. Deterministic pac-bayesian generalization bounds for deep networks via generalizing noise-resilience. arXiv preprint arXiv:1905.13344, 2019a.\n\nVaishnavh Nagarajan and J Zico Kolter. Uniform convergence may be unable to explain generalization in deep learning. In Advances in Neural Information Processing Systems, pp. 11615-11626, 2019b.\n\nVaishnavh Nagarajan, Anders Andreassen, and Behnam Neyshabur. Understanding the failure modes of out-of-distribution generalization. arXiv preprint arXiv:2010.15775, 2020.\n\nYuval Netzer, Tao Wang, Adam Coates, Alessandro Bissacco, Bo Wu, and Andrew Y Ng. Reading digits in natural images with unsupervised feature learning. In Advances in Neural Information Processing Systems (NIPS), 2011.\n\nBehnam Neyshabur. Implicit regularization in deep learning. arXiv preprint arXiv:1709.01953, 2017.\nBehnam Neyshabur, Ryota Tomioka, and Nathan Srebro. Norm-based capacity control in neural networks. In Conference on Learning Theory, pp. 1376-1401, 2015.\n\nBehnam Neyshabur, Srinadh Bhojanapalli, David McAllester, and Nathan Srebro. Exploring generalization in deep learning. arXiv preprint arXiv:1706.08947, 2017.\n\nBehnam Neyshabur, Zhiyuan Li, Srinadh Bhojanapalli, Yann LeCun, and Nathan Srebro. The role of over-parametrization in generalization of neural networks. In International Conference on Learning Representations, 2018.\n\nJianmo Ni, Jiacheng Li, and Julian McAuley. Justifying recommendations using distantly-labeled reviews and fine-grained aspects. In Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing and the 9th International Joint Conference on Natural Language Processing (EMNLP-IJCNLP), 2019.\n\nYaniv Ovadia, Emily Fertig, Jie Ren, Zachary Nado, David Sculley, Sebastian Nowozin, Joshua V Dillon, Balaji Lakshminarayanan, and Jasper Snoek. Can you trust your model's uncertainty? evaluating predictive uncertainty under dataset shift. arXiv preprint arXiv:1906.02530, 2019.\n\nAdam Paszke, Sam Gross, Francisco Massa, Adam Lerer, James Bradbury, Gregory Chanan, Trevor Killeen, Zeming Lin, Natalia Gimelshein, Luca Antiga, Alban Desmaison, Andreas Kopf, Edward Yang, Zachary DeVito, Martin Raison, Alykhan Tejani, Sasank Chilamkurthy, Benoit Steiner, Lu Fang, Junjie Bai, and Soumith Chintala. Pytorch: An imperative style, high-performance deep learning library. In Advances in Neural Information Processing Systems 32, 2019.\n\nEmmanouil A Platanios, Hoifung Poon, Tom M Mitchell, and Eric Horvitz. Estimating accuracy from unlabeled data: A probabilistic logic approach. arXiv preprint arXiv:1705.07086, 2017.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 13,
            "markdown": "Emmanouil Antonios Platanios, Avinava Dubey, and Tom Mitchell. Estimating accuracy from unlabeled data: A bayesian approach. In International Conference on Machine Learning, pp. 1416-1425. PMLR, 2016.\n\nStephan Rabanser, Stephan G\u00fcnnemann, and Zachary C Lipton. Failing loudly: An empirical study of methods for detecting dataset shift. arXiv preprint arXiv:1810.11953, 2018.\n\nAaditya Ramdas, Sashank Jakkam Reddi, Barnab\u00e1s P\u00f3czos, Aarti Singh, and Larry A Wasserman. On the Decreasing Power of Kernel and Distance Based Nonparametric Hypothesis Tests in High Dimensions. In Association for the Advancement of Artificial Intelligence (AAAI), 2015.\n\nBenjamin Recht, Rebecca Roelofs, Ludwig Schmidt, and Vaishaal Shankar. Do cifar-10 classifiers generalize to cifar-10? arXiv preprint arXiv:1806.00451, 2018.\n\nBenjamin Recht, Rebecca Roelofs, Ludwig Schmidt, and Vaishaal Shankar. Do imagenet classifiers generalize to imagenet? In International Conference on Machine Learning, pp. 5389-5400. PMLR, 2019.\n\nMateo Rojas-Carulla, Bernhard Sch\u00f6lkopf, Richard Turner, and Jonas Peters. Invariant models for causal transfer learning. The Journal of Machine Learning Research, 19(1):1309-1342, 2018.\n\nOlga Russakovsky, Jia Deng, Hao Su, Jonathan Krause, Sanjeev Satheesh, Sean Ma, Zhiheng Huang, Andrej Karpathy, Aditya Khosla, Michael Bernstein, et al. Imagenet large scale visual recognition challenge. International journal of computer vision, 115(3):211-252, 2015.\n\nMarco Saerens, Patrice Latinne, and Christine Decaestecker. Adjusting the Outputs of a Classifier to New a Priori Probabilities: A Simple Procedure. Neural Computation, 2002.\n\nVictor Sanh, Lysandre Debut, Julien Chaumond, and Thomas Wolf. Distilbert, a distilled version of bert: smaller, faster, cheaper and lighter. ArXiv, abs/1910.01108, 2019.\n\nShibani Santurkar, Dimitris Tsipras, and Aleksander Madry. Breeds: Benchmarks for subpopulation shift. arXiv preprint arXiv:2008.04859, 2020.\n\nHidetoshi Shimodaira. Improving Predictive Inference Under Covariate Shift by Weighting the Log-Likelihood Function. Journal of Statistical Planning and Inference, 2000.\n\nAndrew F Siegel. Robust regression using repeated medians. Biometrika, 69(1):242-244, 1982.\nChristian Szegedy, Wojciech Zaremba, Ilya Sutskever, Joan Bruna, Dumitru Erhan, Ian Goodfellow, and Rob Fergus. Intriguing Properties of Neural Networks. In International Conference on Learning Representations (ICLR), 2014.\n\nRemi Tachet des Combes, Han Zhao, Yu-Xiang Wang, and Geoffrey J Gordon. Domain adaptation with conditional distribution matching and generalized label shift. Advances in Neural Information Processing Systems, 33, 2020.\nJ. Taylor, B. Earnshaw, B. Mabey, M. Victors, and J. Yosinski. Rxrx1: An image set for cellular morphological variation across many experimental batches. In International Conference on Learning Representations (ICLR), 2019.\n\nAntonio Torralba, Rob Fergus, and William T. Freeman. 80 million tiny images: A large data set for nonparametric object and scene recognition. IEEE Transactions on Pattern Analysis and Machine Intelligence, 30(11):1958-1970, 2008.\n\nHaohan Wang, Songwei Ge, Zachary Lipton, and Eric P Xing. Learning robust global representations by penalizing local predictive power. In Advances in Neural Information Processing Systems, pp. 10506-10518, 2019.\n\nThomas Wolf, Lysandre Debut, Victor Sanh, Julien Chaumond, Clement Delangue, Anthony Moi, Pierric Cistac, Tim Rault, R\u00e9mi Louf, Morgan Funtowicz, Joe Davison, Sam Shleifer, Patrick von Platen, Clara Ma, Yacine Jernite, Julien Plu, Canwen Xu, Teven Le Scao, Sylvain Gugger, Mariama Drame, Quentin Lhoest, and Alexander M. Rush. Transformers: State-of-the-art natural language processing. In Proceedings of the 2020 Conference on Empirical Methods in Natural Language Processing: System Demonstrations, pp. 38-45. Association for Computational Linguistics, 2020.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 14,
            "markdown": "Chhavi Yadav and L\u00e9on Bottou. Cold case: The lost mnist digits. In Advances in Neural Information Processing Systems 32, 2019.\n\nChiyuan Zhang, Samy Bengio, Moritz Hardt, Benjamin Recht, and Oriol Vinyals. Understanding deep learning requires rethinking generalization. arXiv preprint arXiv:1611.03530, 2016.\n\nHongjie Zhang, Ang Li, Jie Guo, and Yanwen Guo. Hybrid models for open set recognition. In European Conference on Computer Vision, pp. 102-117. Springer, 2020.\n\nKun Zhang, Bernhard Sch\u00f6lkopf, Krikamol Muandet, and Zhikun Wang. Domain Adaptation Under Target and Conditional Shift. In International Conference on Machine Learning (ICML), 2013.\n\nWenda Zhou, Victor Veitch, Morgane Austern, Ryan P Adams, and Peter Orbanz. Non-vacuous generalization bounds at the imagenet scale: a pac-bayesian compression approach. arXiv preprint arXiv:1804.05862, 2018.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 15,
            "markdown": "# APPENDIX \n\n## A Proofs from Sec. 3\n\nBefore proving results from Sec. 3, we introduce some notations. Define $\\mathcal{E}(f(x), y):=$ $\\mathbb{I}\\left[y \\notin \\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x)\\right]$. We express the population error on distribution $\\mathcal{D}$ as $\\mathcal{E}_{\\mathcal{D}}(f):=$ $\\mathbb{E}_{(x, y) \\sim \\mathcal{D}}[\\mathcal{E}(f(x), y)]$\n\nProof of Proposition 1. Consider a binary classification problem. Assume $\\mathcal{P}$ be the set of possible target conditional distribution of labels given $p_{s}(x, y)$ and $p_{t}(x)$.\nThe forward direction is simple. If $\\mathcal{P}=\\left\\{p_{t}(y \\mid x)\\right\\}$ is singleton given $p_{s}(x, y)$ and $p_{t}(x)$, then the error of any classifier $f$ on the target domain is identified and is given by\n\n$$\n\\mathcal{E}_{\\mathcal{D}^{T}}(f)=\\mathbb{E}_{x \\sim p_{t}(x), y \\sim p_{t}(y \\mid x)}\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x) \\neq y\\right]\\right]\n$$\n\nFor the reverse direction assume that given $p_{t}(x)$ and $p_{s}(x, y)$, we have two possible distributions $\\mathcal{D}^{T}$ and $\\mathcal{D}^{T^{\\prime}}$ with $p_{t}(y \\mid x), p_{t}^{\\prime}(y \\mid x) \\in \\mathcal{P}$ such that on some $x$ with $p_{t}(x)>0$, we have $p_{t}(y \\mid x) \\neq p_{t}^{\\prime}(y \\mid x)$. Consider $\\mathcal{X}_{M}=\\left\\{x \\in \\mathcal{X} \\mid p_{t}(x)>0\\right.$ and $p_{t}(y=1 \\mid x) \\neq p_{t}^{\\prime}(y=1 \\mid x)\\}$ be the set of all input covariates where the two distributions differ. We will now choose a classifier $f$ such that the error on the two distributions differ. On a subset $\\mathcal{X}_{M}^{1}=\\left\\{x \\in \\mathcal{X} \\mid p_{t}(x)>0\\right.$ and $p_{t}(y=1 \\mid x)>p_{t}^{\\prime}(y=1 \\mid x)\\}$, assume $f(x)=0$ and on a subset $\\mathcal{X}_{M}^{2}=\\left\\{x \\in \\mathcal{X} \\mid p_{t}(x)>0\\right.$ and $p_{t}(y=1 \\mid x)<p_{t}^{\\prime}(y=1 \\mid x)\\}$, assume $f(x)=1$. We will show that the error of $f$ on distribution with $p_{t}(y \\mid x)$ is strictly greater than the error of $f$ on distribution with $p_{t}^{\\prime}(y \\mid x)$. Formally,\n\n$$\n\\begin{aligned}\n& \\mathcal{E}_{\\mathcal{D}^{T}}(f)-\\mathcal{E}_{\\mathcal{D}^{T^{\\prime}}}(f) \\\\\n& =\\mathbb{E}_{x \\sim p_{t}(x), y \\sim p_{t}(y \\mid x)}\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x) \\neq y\\right]\\right]-\\mathbb{E}_{x \\sim p_{t}(x), y \\sim p_{t}^{\\prime}(y \\mid x)}\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x) \\neq y\\right]\\right] \\\\\n& =\\int_{x \\in \\mathcal{X}_{M}} \\mathbb{I}[f(x) \\neq 0]\\left(p_{t}(y=0 \\mid x)-p_{t}^{\\prime}(y=0 \\mid x)\\right) p_{t}(x) d x \\\\\n& \\quad+\\int_{x \\in \\mathcal{X}_{M}} \\mathbb{I}[f(x) \\neq 1]\\left(p_{t}(y=1 \\mid x)-p_{t}^{\\prime}(y=1 \\mid x)\\right) p_{t}(x) d x \\\\\n& =\\int_{x \\in \\mathcal{X}_{M}^{2}}\\left(p_{t}(y=0 \\mid x)-p_{t}^{\\prime}(y=0 \\mid x)\\right) p_{t}(x) d x+\\int_{x \\in \\mathcal{X}_{M}^{1}}\\left(p_{t}(y=1 \\mid x)-p_{t}^{\\prime}(y=1 \\mid x)\\right) p_{t}(x) d x \\\\\n& >0\n\\end{aligned}\n$$\n\nwhere the last step follows by construction of the set $\\mathcal{X}_{M}^{1}$ and $\\mathcal{X}_{M}^{2}$. Since $\\mathcal{E}_{\\mathcal{D}^{T}}(f) \\neq \\mathcal{E}_{\\mathcal{D}^{T^{\\prime}}}(f)$, given the information of $p_{t}(x)$ and $p_{s}(x, y)$ it is impossible to distinguish the two values of the error with classifier $f$. Thus, we obtain a contradiction on the assumption that $p_{t}(y \\mid x) \\neq p_{t}^{\\prime}(y \\mid x)$. Hence, we must pose restrictions on the nature of shift such that $\\mathcal{P}$ is singleton to to identify accuracy on the target.\n\nProof of Corollary 1. The corollary follows directly from Proposition 1. Since two different target conditional distribution can lead to different error estimates without assumptions on the classifier, no method can estimate two different quantities from the same given information. We illustrate this in Example 1 next.\n\n## B ESTIMATING ACCURACY IN COVARIATE SHIFT OR LABEL SHIFT\n\nAccuracy estimation under covariate shift assumption Under the assumption that $p_{t}(y \\mid x)=$ $p_{s}(y \\mid x)$, accuracy on the target domain can be estimated as follows:\n\n$$\n\\begin{aligned}\n\\mathcal{E}_{\\mathcal{D}^{T}}(f) & =\\mathbb{E}_{(x, y) \\sim \\mathcal{D}^{T}}\\left[\\frac{p_{t}(x, y)}{p_{s}(x, y)} \\mathbb{I}[f(x) \\neq y]\\right] \\\\\n& =\\mathbb{E}_{(x, y) \\sim \\mathcal{D}^{T}}\\left[\\frac{p_{t}(x)}{p_{s}(x)} \\mathbb{I}[f(x) \\neq y]\\right]\n\\end{aligned}\n$$",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 16,
            "markdown": "Given access to $p_{t}(x)$ and $p_{s}(x)$, one can directly estimate the expression in (6).\nAccuracy estimation under label shift assumption Under the assumption that $p_{t}(x \\mid y)=p_{s}(x \\mid y)$, accuracy on the target domain can be estimated as follows:\n\n$$\n\\begin{aligned}\n\\mathcal{E}_{\\mathcal{D}^{t}}(f) & =\\mathbb{E}_{(x, y) \\sim \\mathcal{D}^{t}}\\left[\\frac{p_{t}(x, y)}{p_{s}(x, y)} \\mathbb{I}[f(x) \\neq y]\\right] \\\\\n& =\\mathbb{E}_{(x, y) \\sim \\mathcal{D}^{t}}\\left[\\frac{p_{t}(y)}{p_{s}(y)} \\mathbb{I}[f(x) \\neq y]\\right]\n\\end{aligned}\n$$\n\nEstimating importance ratios $p_{t}(x) / p_{s}(x)$ is straightforward under covariate shift assumption when the distributions $p_{t}(x)$ and $p_{s}(x)$ are known. For label shift, one can leverage moment matching approach called BBSE (Lipton et al., 2018) or likelihood minimization approach MLLS (Garg et al., 2020). Below we discuss the objective of MLLS:\n\n$$\nw=\\underset{w \\in \\mathcal{W}}{\\arg \\max } \\mathbb{E}_{x \\sim p_{t}(x)}\\left[\\log p_{s}(y \\mid x)^{T} w\\right]\n$$\n\nwhere $\\mathcal{W}=\\left\\{w \\mid \\forall y, w_{y} \\geqslant 0\\right.$ and $\\left.\\sum_{y=1}^{k} w_{y} p_{s}(y)=1\\right\\}$. MLLS objective is guaranteed to obtain consistent estimates for the importance ratios $w^{*}(y)=p_{t}(y) / p_{s}(y)$ under the following condition.\nTheorem 2 (Theorem 1 (Garg et al., 2020)). If the distributions $\\{p(x) \\mid y): y=1, \\ldots, k\\}$ are strictly linearly independent, then $w^{*}$ is the unique maximizer of the MLLS objective (9).\nWe refer interested reader to Garg et al. (2020) for details.\nAbove results of accuracy estimation under label shift and covariate shift can be extended to a generalized label shift and covariate shift settings. Assume a function $h: \\mathcal{X} \\rightarrow \\mathcal{Z}$ such that $y$ is independent of $x$ given $h(x)$. In other words $h(x)$ contains all the information needed to predict label $y$. With help of $h$, we can extend estimation to following settings: (i) Generalized covariate shift, i.e., $p_{s}(y \\mid h(x))=p_{t}(y \\mid h(x))$ and $p_{s}(h(x))>0$ for all $x \\in \\mathcal{X}_{t}$; (ii) Generalized label shift, i.e., $p_{s}(h(x) \\mid y)=p_{t}(h(x) \\mid y)$ and $p_{s}(y)>0$ for all $y \\in \\mathcal{Y}_{t}$. By simply replacing $x$ with $h(x)$ in (6) and (9), we will obtain consistent error estimates under these generalized conditions.\n\nProof of Example 1. Under covariate shift using (6), we get\n\n$$\n\\begin{aligned}\n\\mathcal{E}_{1} & =\\mathbb{E}_{(x, y) \\sim p_{s}(x, y)}\\left[\\frac{p_{t}(x)}{p_{s}(x)} \\mathbb{I}[f(x) \\neq y]\\right] \\\\\n& =\\mathbb{E}_{x \\sim p_{s}(x, y=0)}\\left[\\frac{p_{t}(x)}{p_{s}(x)} \\mathbb{I}[f(x) \\neq 0]\\right]+\\mathbb{E}_{x \\sim p_{s}(x, y=1)}\\left[\\frac{p_{t}(x)}{p_{s}(x)} \\mathbb{I}[f(x) \\neq 1]\\right] \\\\\n& =\\int \\mathbb{I}[f(x) \\neq 0] p_{t}(x) p_{s}(y=0 \\mid x) d x+\\int \\mathbb{I}[f(x) \\neq 1] p_{t}(x) p_{s}(y=1 \\mid x) d x\n\\end{aligned}\n$$\n\nUnder label shift using (8), we get\n\n$$\n\\begin{aligned}\n\\mathcal{E}_{2} & =\\mathbb{E}_{(x, y) \\sim \\mathcal{D}^{t}}\\left[\\frac{p_{t}(y)}{p_{s}(y)} \\mathbb{I}[f(x) \\neq y]\\right] \\\\\n& =\\mathbb{E}_{x \\sim p_{s}(x, y=0)}\\left[\\frac{\\beta}{\\alpha} \\mathbb{I}[f(x) \\neq 0]\\right]+\\mathbb{E}_{x \\sim p_{s}(x, y=1)}\\left[\\frac{1-\\beta}{1-\\alpha} \\mathbb{I}[f(x) \\neq 1]\\right] \\\\\n& =\\int \\mathbb{I}[f(x) \\neq 0] \\frac{\\beta}{\\alpha} p_{s}(y=0 \\mid x) p_{s}(x) d x+\\int \\mathbb{I}[f(x) \\neq 1] \\frac{(1-\\beta)}{(1-\\alpha)} p_{s}(y=1 \\mid x) p_{s}(x) d x\n\\end{aligned}\n$$\n\nThen $\\mathcal{E}_{1}-\\mathcal{E}_{2}$ is given by\n\n$$\n\\begin{aligned}\n\\mathcal{E}_{1}-\\mathcal{E}_{2} & =\\int \\mathbb{I}[f(x) \\neq 0] p_{s}(y=0 \\mid x)\\left[p_{t}(x)-\\frac{\\beta}{\\alpha} p_{s}(x)\\right] d x \\\\\n& +\\int \\mathbb{I}[f(x) \\neq 1] p_{s}(y=1 \\mid x)\\left[p_{t}(x)-\\frac{(1-\\beta)}{(1-\\alpha)} p_{s}(x)\\right] d x \\\\\n& =\\int \\mathbb{I}[f(x) \\neq 0] p_{s}(y=0 \\mid x) \\frac{(\\alpha-\\beta)}{\\alpha} \\phi\\left(\\mu_{2}\\right) d x \\\\\n& +\\int \\mathbb{I}[f(x) \\neq 1] p_{s}(y=1 \\mid x) \\frac{(\\alpha-\\beta)}{1-\\alpha} \\phi\\left(\\mu_{1}\\right) d x\n\\end{aligned}\n$$",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 17,
            "markdown": "If $\\alpha>\\beta$, then $\\mathcal{E}_{1}>\\mathcal{E}_{2}$ and if $\\alpha<\\beta$, then $\\mathcal{E}_{1}<\\mathcal{E}_{2}$. Since $\\mathcal{E}_{1} \\neq \\mathcal{E}_{2}$ for arbitrary $f$, given access to $p_{s}(x, y)$, and $p_{t}(x)$, any method that consistently estimates error under covariate shift will give an incorrect estimate under label shift and vice-versa. The reason being that the same $p_{t}(x)$ and $p_{s}(x, y)$ can correspond to error $\\mathcal{E}_{1}$ (under covariate shift) or error $\\mathcal{E}_{2}$ (under label shift) either of which is not discernable absent further assumptions on the nature of shift.\n\n# C Alternate interpretation of ATC \n\nConsider the following framework: Given a datum $(x, y)$, define a binary classification problem of whether the model prediction $\\arg \\max f(x)$ was correct or incorrect. In particular, if the model prediction matches the true label, then we assign a label 1 (positive) and conversely, if the model prediction doesn't match the true label then we assign a label 0 (negative).\nOur method can be interpreted as identifying examples for correct and incorrect prediction based on the value of the score function $s(f(x))$, i.e., if the score $s(f(x))$ is greater than or equal to the threshold $t$ then our method predicts that the classifier correctly predicted datum $(x, y)$ and vice-versa if the score is less than $t$. A method that can solve this task will perfectly estimate the target performance. However, such an expectation is unrealistic. Instead, ATC expects that most of the examples with score above threshold are correct and most of the examples below the threshold are incorrect. More importantly, ATC selects a threshold such that the number of falsely identified correct predictions match falsely identified incorrect predictions on source distribution, thereby balancing incorrect predictions. We expect useful estimates of accuracy with ATC if the threshold transfers to target, i.e. if the number of falsely identified correct predictions match falsely identified incorrect predictions on target. This interpretation relates our method to the OOD detection literature where Hendrycks \\& Gimpel (2016); Hendrycks et al. (2019) highlight that classifiers tend to assign higher confidence to in-distribution examples and leverage maximum softmax confidence (or logit) to perform OOD detection.\n\n## D Details on the Toy Model\n\nSkews observed in this toy model In Fig. 4, we illustrate the toy model used in our empirical experiment. In the same setup, we empirically observe that the margin on population with less density is large, i.e., margin is much greater than $\\gamma$ when the number of observed samples is small (in Fig. 4 (d)). Building on this observation, Nagarajan et al. (2020) showed in cases when margin decreases with number of samples, a max margin classifier trained on finite samples is bound to depend on the spurious features in such cases. They referred to this skew as geometric skew.\n\nMoreover, even when the number of samples are large so that we do not observe geometric skews, Nagarajan et al. (2020) showed that training for finite number of epochs, a linear classifier will have a non zero dependency on the spurious feature. They referred to this skew as statistical skew. Due both of these skews, we observe that a linear classifier obtained with training for finite steps on training data with finite samples, will have a non-zero dependency on the spurious feature. We refer interested reader to Nagarajan et al. (2020) for more details.\nProof of Theorem 1 Recall, we consider a easy-to-learn binary classification problem with two features $x=\\left[x_{\\mathrm{inv}}, x_{\\mathrm{sp}}\\right] \\in \\mathbb{R}^{2}$ where $x_{\\mathrm{inv}}$ is fully predictive invariant feature with a margin $\\gamma>0$ and $x_{\\mathrm{sp}} \\in\\{-1,1\\}$ is a spurious feature (i.e., a feature that is correlated but not predictive of the true label). Conditional on $y$, the distribution over $x_{\\text {inv }}$ is given as follows:\n\n$$\nx_{\\mathrm{inv}} \\mid y \\sim\\left\\{\\begin{array}{lr}\nU[\\gamma, c] & y=1 \\\\\nU[-c,-\\gamma] & y=-1\n\\end{array}\\right.\n$$\n\nwhere $c$ is a fixed constant greater than $\\gamma$. For simplicity, we assume that label distribution on source is uniform on $\\{-1,1\\} . x_{\\text {sp }}$ is distributed such that $P_{s}\\left[x_{\\text {sp }} \\cdot(2 y-1)>0\\right]=p_{\\text {sp }}$, where $p_{\\text {sp }} \\in(0.5,1.0)$ controls the degree of spurious correlation. To model distribution shift, we simulate target data with different degree of spurious correlation, i.e., in target distribution $P_{t}\\left[x_{\\text {sp }} \\cdot(2 y-1)>0\\right]=p_{\\text {sp }}^{\\prime} \\in[0,1]$. Note that here we do not consider shifts in the label distribution but our result extends to arbitrary shifts in the label distribution as well.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 18,
            "markdown": "![img-3.jpeg](img-3.jpeg)\n\nFigure 4: Illustration of toy model. (a) Source data at $n=100$. (b) Target data with $p_{s}^{\\prime}=0.5$. (b) Target data with $p_{s}^{\\prime}=0.9$. (c) Margin of $x_{\\text {inv }}$ in the minority group in source data. As sample size increases the margin saturates to true margin $\\gamma=0.1$.\n\nIn this setup, we examine linear sigmoid classifiers of the form $f(x)=\\left[\\frac{1}{1+e^{w T x}}, \\frac{e^{w T x}}{1+e^{w T x}}\\right]$ where $w=\\left[w_{\\text {inv }}, w_{\\text {sp }}\\right] \\in \\mathbb{R}^{2}$. We show that given a linear classifier that relies on the spurious feature and achieves a non-trivial performance on the source (i.e., $w_{\\text {inv }}>0$ ), ATC with maximum confidence score function consistently estimates the accuracy on the target distribution. Define $X_{M}=\\left\\{x \\mid x_{\\text {sp }}\\right.$ $\\left.(2 y-1)<0\\right\\}$ and $X_{C}=\\left\\{x \\mid x_{\\text {sp }} \\cdot(2 y-1)>0\\right\\}$. Notice that in target distributions, we are changing the fraction of examples in $X_{M}$ and $X_{C}$ but we are not changing the distribution of examples within individual set.\nTheorem 3. Given any classifier $f$ with $w_{\\text {inv }}>0$ in the above setting, assume that the threshold $t$ is obtained with finite sample approximation of (1), i.e., $t$ is selected such that ${ }^{2}$\n\n$$\n\\sum_{i=1}^{n}\\left[\\mathbb{I}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}\\left(x_{i}\\right)<t\\right]\\right]=\\sum_{i=1}^{n}\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}\\left(x_{i}\\right) \\neq y_{i}\\right]\\right]\n$$\n\nwhere $\\left\\{\\left(x_{i}, y_{i}\\right)\\right\\}_{i=1}^{n} \\sim\\left(\\mathcal{D}^{\\delta}\\right)^{n}$ are $n$ samples from source distribution. Fix a $\\delta>0$. Assuming $n \\geqslant 2 \\log (4 / \\delta) /\\left(1-p_{s p}\\right)^{2}$, then the estimate of accuracy by ATC as in (2) satisfies the following with probability at least $1-\\delta$,\n\n$$\n\\left|\\mathbb{E}_{x \\sim \\mathcal{D}^{t}}[\\mathbb{I}[s(f(x))<t]]-\\mathbb{E}_{(x, y) \\sim \\mathcal{D}^{t}}\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x) \\neq y\\right]\\right]\\right| \\leqslant \\sqrt{\\frac{\\log (8 / \\delta)}{n \\cdot c_{s p}}}\n$$\n\nwhere $\\mathcal{D}^{t}$ is any target distribution considered in our setting and $c_{s p}=\\left(1-p_{s p}\\right)$ if $w_{s p}>0$ and $c_{s p}=p_{s p}$ otherwise.\n\n[^0]\n[^0]:    ${ }^{2}$ Note that this is possible because a linear classifier with sigmoid activation assigns a unique score to each point in source distribution.",
            "images": [
                {
                    "id": "img-3.jpeg",
                    "top_left_x": 358,
                    "top_left_y": 224,
                    "bottom_right_x": 1354,
                    "bottom_right_y": 972,
                    "image_base64": "..."
                }
            ],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 19,
            "markdown": "Proof. First we consider the case of $w_{\\text {sp }}>0$. The proof follows in two simple steps. First we notice that the classifier will make an error only on some points in $X_{M}$ and the threshold $t$ will be selected such that the fraction of points in $X_{M}$ with maximum confidence less than the threshold $t$ will match the error of the classifier on $X_{M}$. Classifier with $w_{\\text {sp }}>0$ and $w_{\\text {inv }}>0$ will classify all the points in $X_{C}$ correctly. Second, since the distribution of points is not changing within $X_{M}$ and $X_{C}$, the same threshold continues to work for arbitrary shift in the fraction of examples in $X_{M}$, i.e., $p_{\\text {sp }}^{\\prime}$.\n\nNote that when $w_{\\text {sp }}>0$, the classifier makes no error on points in $X_{C}$ and makes an error on a subset $X_{\\text {err }}=\\left\\{x \\mid x_{\\text {sp }} \\cdot(2 y-1)<0 \\&\\left(w_{\\text {inv }} x_{\\text {inv }}+w_{\\text {sp }} x_{\\text {sp }}\\right) \\cdot(2 y-1) \\leqslant 0\\right\\}$ of $X_{M}$, i.e., $X_{\\text {err }} \\subseteq X_{M}$. Consider $X_{\\text {thres }}=\\left\\{x \\mid \\arg \\max _{y \\in \\mathcal{Y}} f_{y}(x) \\leqslant t\\right\\}$ as the set of points that obtain a score less than or equal to $t$. Now we will show that ATC chooses a threshold $t$ such that all points in $X_{C}$ gets a score above $t$, i.e., $X_{\\text {thres }} \\subseteq X_{M}$. First note that the score of points close to the true separator in $X_{C}$, i.e., at $x_{1}=(\\gamma, 1)$ and $x_{2}=(-\\gamma,-1)$ match. In other words, score at $x_{1}$ matches with the score of $x_{2}$ by symmetricity, i.e.,\n\n$$\n\\underset{y \\in \\mathcal{Y}}{\\arg \\max } f_{y}\\left(x_{1}\\right)=\\underset{y \\in \\mathcal{Y}}{\\arg \\max } f_{y}\\left(x_{2}\\right)=\\frac{e^{w_{\\text {inv }} \\gamma+w_{\\text {sp }}}}{\\left(1+e^{w_{\\text {inv }} \\gamma+w_{\\text {sp }}}\\right)}\n$$\n\nHence, if $t \\geqslant \\arg \\max _{y \\in \\mathcal{Y}} f_{y}\\left(x_{1}\\right)$ then we will have $\\left|X_{\\text {err }}\\right|<\\left|X_{\\text {thres }}\\right|$ which is contradiction violating definition of $t$ as in (12). Thus $X_{\\text {thres }} \\subseteq X_{M}$.\n\nNow we will relate LHS and RHS of (12) with their expectations using Hoeffdings and DKW inequality to conclude (13). Using Hoeffdings' bound, we have with probability at least $1-\\delta / 4$\n\n$$\n\\left|\\sum_{i \\in X_{M}} \\frac{\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}\\left(x_{i}\\right) \\neq y_{i}\\right]\\right]}{\\left|X_{M}\\right|}-\\mathbb{E}_{(x, y) \\sim \\mathcal{D}^{\\mathrm{T}}}\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x) \\neq y\\right]\\right]\\right| \\leqslant \\sqrt{\\frac{\\log (8 / \\delta)}{2\\left|X_{M}\\right|}}\n$$\n\nWith DKW inequality, we have with probability at least $1-\\delta / 4$\n\n$$\n\\left|\\sum_{i \\in X_{M}} \\frac{\\left[\\mathbb{I}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}\\left(x_{i}\\right)<t^{\\prime}\\right]\\right]}{\\left|X_{M}\\right|}-\\mathbb{E}_{(x, y) \\sim \\mathcal{D}^{\\mathrm{T}}}\\left[\\mathbb{I}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}(x)<t^{\\prime}\\right]\\right]\\right| \\leqslant \\sqrt{\\frac{\\log (8 / \\delta)}{2\\left|X_{M}\\right|}}\n$$\n\nfor all $t^{\\prime}>0$. Combining (15) and (16) at $t^{\\prime}=t$ with definition (12), we have with probability at least $1-\\delta / 2$\n\n$$\n\\left|\\mathbb{E}_{x \\sim \\mathcal{D}^{\\mathrm{T}}}[I(s(f(x))<t]]-\\mathbb{E}_{(x, y) \\sim \\mathcal{D}^{\\mathrm{T}}}\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x) \\neq y\\right]\\right]\\right| \\leqslant \\sqrt{\\frac{\\log (8 / \\delta)}{2\\left|X_{M}\\right|}}\n$$\n\nNow for the case of $w_{\\text {sp }}<0$, we can use the same arguments on $X_{C}$. That is, since now all the error will be on points in $X_{C}$ and classifier will make no error $X_{M}$, we can show that threshold $t$ will be selected such that the fraction of points in $X_{C}$ with maximum confidence less than the threshold $t$ will match the error of the classifier on $X_{C}$. Again, since the distribution of points is not changing within $X_{M}$ and $X_{C}$, the same threshold continues to work for arbitrary shift in the fraction of examples in $X_{M}$, i.e., $p_{\\text {sp }}^{\\prime}$. Thus with similar arguments, we have\n\n$$\n\\left|\\mathbb{E}_{x \\sim \\mathcal{D}^{\\mathrm{T}}}[I(s(f(x))<t]]-\\mathbb{E}_{(x, y) \\sim \\mathcal{D}^{\\mathrm{T}}}\\left[I\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x) \\neq y\\right]\\right]\\right| \\leqslant \\sqrt{\\frac{\\log (8 / \\delta)}{2\\left|X_{C}\\right|}}\n$$\n\nUsing Hoeffdings' bound, with probability at least $1-\\delta / 2$, we have\n\n$$\n\\left|X_{M}-n \\cdot\\left(1-p_{\\text {sp }}\\right)\\right| \\leqslant \\sqrt{\\frac{n \\cdot \\log (4 / \\delta)}{2}}\n$$\n\nWith probability at least $1-\\delta / 2$, we have\n\n$$\n\\left|X_{C}-n \\cdot p_{\\text {sp }}\\right| \\leqslant \\sqrt{\\frac{n \\cdot \\log (4 / \\delta)}{2}}\n$$\n\nCombining (19) and (17), we get the desired result for $w_{\\text {sp }}>0$. For $w_{\\text {sp }}<0$, we combine (20) and (18) to get the desired result.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 20,
            "markdown": "![img-4.jpeg](img-4.jpeg)\n\nFigure 5: Failure of ATC in our toy model. Shifting the support of target class conditional $p_{t}\\left(x_{\\text {inv }} \\mid y\\right)$ may introduce a bias in ATC estimates, e.g., shrinking the support to $c_{1}(<c)$ (while maintaining uniform distribution) in the target leads to overestimation bias.\n\nIssues with IM in toy setting As described in App. E, we observe that IM is sensitive to binning strategy. In the main paper, we include IM result with uniform mass binning with 100 bins. Empirically, we observe that we recover the true performance with IM if we use equal width binning with number of bins greater than 5 .\n\nBiased estimation with ATC in our toy model We assumed that both in source and target $x_{\\text {inv }} \\mid y=1$ is uniform between $[\\gamma, c]$ and $x \\mid y=-1$ is uniform between $[-c,-\\gamma]$. Shifting the support of target class conditional $p_{t}\\left(x_{\\text {inv }} \\mid y\\right)$ may introduce a bias in ATC estimates, e.g., shrinking the support to $c_{1}(<c)$ (while maintaining uniform distribution) in the target will lead to an over-estimation of the target performance with ATC. We show this failure in Fig. 5. The reason being that with the same threshold that we see more examples falsely identified as correct as compared to examples falsely identified as incorrect.\n\n# D. 1 A More General Result \n\nRecall, for a given threshold $t$, we categorize an example $(x, y)$ as a falsely identified correct prediction (ficp) if the predicted label $\\widehat{y}=\\arg \\max f(x)$ is not the same as $y$ but the predicted score $f_{\\widehat{y}}(x)$ is greater than $t$. Similarly, an example is falsely identified incorrect prediction (fiip) if the predicted label $\\widehat{y}$ is the same as $y$ but the predicted score $f_{\\widehat{y}}(x)$ is less than $t$.\n\nIn general, we believe that our method will obtain consistent estimates in scenarios where the relative distribution of covariates doesn't change among examples that are falsely identified as incorrect and examples that are falsely identified as correct. In other words, ATC is expected to work if the distribution shift is such that falsely identified incorrect predictions match falsely identified correct prediction.\n\n## D. 2 ATC PRODUCES CONSISTENT ESTIMATE ON SOURCE DISTRIBUTION\n\nProposition 2. Given labeled validation data $\\left\\{\\left(x_{i}, y_{i}\\right)\\right\\}_{i=1}^{n}$ from a distribution $\\mathcal{D}^{S}$ and a model $f$, choose a threshold $t$ as in (1). Then for $\\delta>0$, with probability at least $1-\\delta$, we have\n\n$$\n\\mathbb{E}_{(x, y) \\sim \\mathcal{D}}\\left[\\mathbb{I}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}(x)<t\\right]-\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x) \\neq y\\right]\\right] \\leqslant 2 \\sqrt{\\frac{\\log (4 / \\delta)}{2 n}}\n$$\n\nProof. The proof uses (i) Hoeffdings' inequality to relate the accuracy with expected accuracy; and (ii) DKW inequality to show the concentration of the estimated accuracy with our proposed method. Finally, we combine (i) and (ii) using the fact that at selected threshold $t$ the number of false positives is equal to the number of false negatives.\nUsing Hoeffdings' bound, we have with probability at least $1-\\delta / 2$\n\n$$\n\\left|\\sum_{i=1}^{n}\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}\\left(x_{i}\\right) \\neq y_{i}\\right]\\right]-\\mathbb{E}_{(x, y) \\sim \\mathcal{D}}\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x) \\neq y\\right]\\right]\\right| \\leqslant \\sqrt{\\frac{\\log (4 / \\delta)}{2 n}}\n$$",
            "images": [
                {
                    "id": "img-4.jpeg",
                    "top_left_x": 623,
                    "top_left_y": 217,
                    "bottom_right_x": 1065,
                    "bottom_right_y": 567,
                    "image_base64": "..."
                }
            ],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 21,
            "markdown": "With DKW inequality, we have with probability at least $1-\\delta / 2$\n\n$$\n\\left|\\sum_{i=1}^{n}\\left[\\mathbb{I}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}\\left(x_{i}\\right)<t^{\\prime}\\right]\\right]-\\mathbb{E}_{(x, y) \\sim \\mathcal{D}}\\left[\\mathbb{I}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}(x)<t^{\\prime}\\right]\\right]\\right| \\leqslant \\sqrt{\\frac{\\log (4 / \\delta)}{2 n}}\n$$\n\nfor all $t^{\\prime}>0$. Finally by definition, we have\n\n$$\n\\sum_{i=1}^{n}\\left[\\mathbb{I}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}\\left(x_{i}\\right)<t^{\\prime}\\right]\\right]=\\sum_{i=1}^{n}\\left[\\mathbb{I}\\left[\\underset{j \\in \\mathcal{Y}}{\\arg \\max } f_{j}\\left(x_{i}\\right) \\neq y_{i}\\right]\\right]\n$$\n\nCombining (22), (23) at $t^{\\prime}=t$, and (24), we have the desired result.\n\n# E BASLINE METHODS \n\nImportance-re-weighting (IM) If we can estimate the importance-ratios $\\frac{p_{1}(x)}{p_{s}(x)}$ with just the unlabeled data from the target and validation labeled data from source, then we can estimate the accuracy as on target as follows:\n\n$$\n\\mathcal{E}_{\\mathcal{D}^{t}}(f)=\\mathbb{E}_{(x, y) \\sim \\mathcal{D}^{t}}\\left[\\frac{p_{t}(x)}{p_{s}(x)} \\mathbb{I}[f(x) \\neq y]\\right]\n$$\n\nAs previously discussed, this is particularly useful in the setting of covariate shift (within support) where importance ratios estimation has been explored in the literature in the past. Mandolin (Chen et al., 2021b) extends this approach. They estimate importance-weights with use of extra supervision about the axis along which the distribution is shifting.\nIn our work, we experiment with uniform mass binning and equal width binning with the number of bins in $[5,10,50]$. Overall, we observed that equal width binning works the best with 10 bins. Hence throughout this paper we perform equal width binning with 10 bins to include results with IM.\nAverage Confidence (AC) If we expect the classifier to be argmax calibrated on the target then average confidence is equal to accuracy of the classifier. Formally, by definition of argmax calibration of $f$ on any distribution $\\mathcal{D}$, we have\n\n$$\n\\mathcal{E}_{\\mathcal{D}}(f)=\\mathbb{E}_{(x, y) \\sim \\mathcal{D}}\\left[\\mathbb{I}\\left[y \\notin \\underset{j \\in \\mathcal{Y}}{\\arg \\max } f_{j}(x)\\right]\\right]=\\mathbb{E}_{(x, y) \\sim \\mathcal{D}}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}(x)\\right]\n$$\n\nDifference Of Confidence We estimate the error on target by subtracting difference of confidences on source and target (as a distributional distance (Guillory et al., 2021)) from expected error on source distribution, i.e, $\\mathrm{DOC}_{\\mathcal{D}^{t}}=\\mathbb{E}_{x \\sim \\mathcal{D}^{t}}\\left[\\mathbb{I}\\left[\\arg \\max _{j \\in \\mathcal{Y}} f_{j}(x) \\neq y\\right]\\right]+\\mathbb{E}_{x \\sim \\mathcal{D}^{t}}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}(x)\\right]-$ $\\mathbb{E}_{x \\sim \\mathcal{D}^{t}}\\left[\\max _{j \\in \\mathcal{Y}} f_{j}(x)\\right]$. This is referred to as DOC-Feat in (Guillory et al., 2021).\nGeneralized Disagreement Equality (GDE) Jiang et al. (2021) proposed average disagreement of two models (trained on the same training set but with different initialization and/or different data ordering) as a approximate measure of accuracy on the underlying data, i.e.,\n\n$$\n\\mathcal{E}_{\\mathcal{D}}(f)=\\mathbb{E}_{(x, y) \\sim \\mathcal{D}}\\left[\\mathbb{I}\\left[f(x) \\neq f^{\\prime}(x)\\right]\\right]\n$$\n\nThey show that marginal calibration of the model is sufficient to have expected test error equal to the expected of average disagreement of two models where the latter expectation is also taken over the models used to calculate disagreement.\n\n## F DETAILS ON THE DATASET SETUP\n\nIn our empirical evaluation, we consider both natural and synthetic distribution shifts. We consider shifts on ImageNet (Russakovsky et al., 2015), CIFAR Krizhevsky \\& Hinton (2009), FMoWWilDS (Christie et al., 2018), RxRx1-WilDS (Taylor et al., 2019), Amazon-WilDS (Ni et al., 2019), CivilComments-WilDS (Borkan et al., 2019), and MNIST LeCun et al. (1998) datasets.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 22,
            "markdown": "| Train (Source) | Valid (Source) | Evaluation (Target) |\n| :--: | :--: | :--: |\n| MNIST (train) | MNIST (valid) | USPS, SVHN and Q-MNIST |\n| CIFAR10 (train) | CIFAR10 (valid) | CIFAR10v2, 95 CIFAR10-C datasets (Fog and Motion blur, etc. ) |\n| CIFAR100 (train) | CIFAR100 (valid) | 95 CIFAR100-C datasets (Fog and Motion blur, etc. ) |\n| FMoW (2002-12) (train) | FMoW (2002-12) (valid) | FMoW $\\{2013-15,2016-17\\} \\times$ |\n|  |  | (All, Africa, Americas, Oceania, Asia, and Europe) $\\}$ |\n| RxRx1 (train) | RxRx1(id-val) | RxRx1 (id-test, OOD-val, OOD-test) |\n| Amazon (train) | Amazon (id-val) | Amazon (OOD-val, OOD-test) |\n| CivilComments (train) | CivilComments (id-val) | CivilComments (8 demographic identities male, female, LGBTQ, Christian, Muslim, other religions, Black, and White) |\n| ImageNet (train) | ImageNet (valid) | 3 ImageNetv2 datasets, ImageNet-Sketch, 95 ImageNet-C datasets |\n| ImageNet-200 (train) | ImageNet-200 (valid) | 3 ImageNet-200v2 datasets, ImageNet-R, ImageNet200-Sketch, 95 ImageNet200-C datasets |\n| BREEDS (train) | BREEDS (valid) | Same subpopulations as train but unseen images from natural and synthetic shifts in ImageNet, Novel subpopulations on natural and synthetic shifts |\n\nTable 2: Details of the test datasets considered in our evaluation.\n\nImageNet setup. First, we consider synthetic shifts induced to simulate 19 different visual corruptions (e.g., shot noise, motion blur, pixelation etc.) each with 5 different intensities giving us a total of 95 datasets under ImageNet-C (Hendrycks \\& Dietterich, 2019). Next, we consider natural distribution shifts due to differences in the data collection process. In particular, we consider 3 ImageNetv2 (Recht et al., 2019) datasets each using a different strategy to collect test sets. We also evaluate performance on images with artistic renditions of object classes, i.e., ImageNet-R (Hendrycks et al., 2021) and ImageNet-Sketch (Wang et al., 2019) with hand drawn sketch images. Note that renditions dataset only contains 200 classes from ImageNet. Hence, in the main paper we include results on ImageNet restricted to these 200 classes, which we call as ImageNet-200, and relegate results on ImageNet with 1 k classes to appendix.\nWe also consider BREEDS benchmark (Santurkar et al., 2020) in our evaluation to assess robustness to subpopulation shifts, in particular, to understand how accuracy estimation methods behave when novel subpopulations not observed during training are introduced. BREEDS leverages class hierarchy in ImageNet to repurpose original classes to be the subpopulations and defines a classification task on superclasses. Subpopulation shift is induced by directly making the subpopulations present in the training and test distributions disjoint. Overall, BREEDS benchmark contains 4 datasets Entity-13, Entity-30, Living-17, Non-Living-26, each focusing on different subtrees in the hierarchy. To generate BREEDS dataset on top of ImageNet, we use the open source library: https: //github.com/MadryLab/BREEDS-Benchmarks. We focus on natural and synthetic shifts as in ImageNet on same and different subpopulations in BREEDs. Thus for both the subpopulation (same or novel), we obtain a total of 99 target datasets.\n\nCIFAR setup. Similar to the ImageNet setup, we consider (i) synthetic shifts (CIFAR-10-C) due to common corruptions; and (ii) natural distribution shift (i.e., CIFARv2 (Recht et al., 2018; Torralba et al., 2008)) due to differences in data collection strategy on on CIFAR-10 (Krizhevsky \\& Hinton, 2009). On CIFAR-100, we just have synthetic shifts due to common corruptions.\n\nFMoW-WILDS setup. In order to consider distribution shifts faced in the wild, we consider FMoWwILDS (Koh et al., 2021; Christie et al., 2018) from WILDS benchmark, which contains satellite images taken in different geographical regions and at different times. We obtain 12 different OOD target sets by considering images between years 2013-2016 and 2016-2018 and by considering five geographical regions as subpopulations (Africa, Americas, Oceania, Asia, and Europe) separately and together.\n$R x R x 1$-WILDS setup. Similar to FMoW, we consider RxRx1-WILDS (Taylor et al., 2019) from WILDS benchmark, which contains image of cells obtained by fluorescent microscopy and the task",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 23,
            "markdown": "is to genetic treatments the cells received. We obtain 3 target datasets with shift induced by batch effects which make it difficult to draw conclusions from data across experimental batches.\nAmazon-WilDS setup. For natural language task, we consider Amazon-WilDS (Ni et al., 2019) dataset from WILDS benchmark, which contains review text and the task is get a corresponding star rating from 1 to 5 . We obtain 2 target datasets by considered shifts induced due to different set of reviewers than the training set.\n\nCivilComments-WilDS setup. We also consider CivilComments-WilDS (Borkan et al., 2019) from WILDS benchmark, which contains text comments and the task is to classify them for toxicity. We obtain 18 target datasets depending on whether a comment mentions each of the 8 demographic identities male, female, LGBTQ, Christian, Muslim, other religions, Black, and White.\n\nMNIST setup. For completeness, we also consider distribution shifts on MNIST (LeCun et al., 1998) digit classification as in the prior work (Deng \\& Zheng, 2021). We use three real shifted datasets, i.e., USPS (Hull, 1994), SVHN (Netzer et al., 2011) and QMNIST (Yadav \\& Bottou, 2019).\n\n# G Details on the Experimental Setup \n\nAll experiments were run on NVIDIA Tesla V100 GPUs. We used PyTorch (Paszke et al., 2019) for experiments.\n\nDeep nets We consider a 4-layered MLP. The PyTorch code for 4-layer MLP is as follows:\n\n```\nnn.Sequential(nn.Flatten(),\n    nn.Linear(input_dim, 5000, bias=True),\n    nn.ReLU(),\n    nn.Linear(5000, 5000, bias=True),\n    nn.ReLU(),\n    nn.Linear(5000, 50, bias=True),\n    nn.ReLU(),\n    nn.Linear(50, num_label, bias=True)\n    )\n```\n\nWe mainly experiment convolutional nets. In particular, we use ResNet18 (He et al., 2016), ResNet50, and DenseNet121 (Huang et al., 2017) architectures with their default implementation in PyTorch. Whenever we initial our models with pre-trained models, we again use default models in PyTorch.\n\nHyperparameters and Training details As mentioned in the main text we do not alter the standard training procedures and hyperparameters for each task. We present results at final model, however, we observed that the same results extend to an early stopped model as well. For completeness, we include these details below:\n\nCIFAR10 and CIFAR100 We train DenseNet121 and ResNet18 architectures from scratch. We use SGD training with momentum of 0.9 for 300 epochs. We start with learning rate 0.1 and decay it by multiplying it with 0.1 every 100 epochs. We use a weight decay of $5^{-} 4$. We use batch size of 200 . For CIFAR10, we also experiment with the same models pre-trained on ImageNet.\n\nImageNet For training, we use Adam with a batch size of 64 and learning rate 0.0001 . Due to huge size of ImageNet, we could only train two models needed for GDE for 10 epochs. Hence, for relatively small scale experiments, we also perform experiments on ImageNet subset with 200 classes, which we call as ImageNet-200 with the same training procedure. These 200 classes are the same classes as in ImageNet-R dataset. This not only allows us to train ImageNet for 50 epochs but also allows us to use ImageNet-R in our testbed. On the both the datasets, we observe a similar superioriy with ATC. Note that all the models trained here were initialized with a pre-trained ImageNet model with the last layer replaced with random weights.\n\nFMoW-wilDS For all experiments, we follow Koh et al. (2021) and use two architectures DenseNet121 and ResNet50, both pre-trained on ImageNet. We use the Adam optimizer (Kingma \\& Ba, 2014) with an initial learning rate of $10^{-4}$ that decays by 0.96 per epoch, and train for 50 epochs and with a batch size of 64 .",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 24,
            "markdown": "$R x R x l$-WILDS For all experiments, we follow Koh et al. (2021) and use two architectures DenseNet121 and ResNet50, both pre-trained on ImageNet. We use Adam optimizer with a learning rate of $1 e-4$ and L2-regularization strength of $1 e-5$ with a batch size of 75 for 90 epochs. We linearly increase the learning rate for 10 epochs, then decreasing it following a cosine learning rate schedule. Finally, we pick the model that obtains highest in-distribution validation accuracy.\nAmazon-WILDS For all experiments, we follow Koh et al. (2021) and finetuned DistilBERT-base-uncased models (Sanh et al., 2019), using the implementation from Wolf et al. (2020), and with the following hyperparameter settings: batch size 8 ; learning rate $1 e-5$ with the AdamW optimizer (Loshchilov \\& Hutter, 2017); L2-regularization strength 0.01; 3 epochs with early stopping; and a maximum number of tokens of 512 .\nCivilComments-WILDS For all experiments, we follow Koh et al. (2021) and fine-tuned DistilBERT-base-uncased models (Sanh et al., 2019), using the implementation from Wolf et al. (2020) and with the following hyperparameter settings: batch size 16 ; learning rate $1 e-5$ with the AdamW optimizer (Loshchilov \\& Hutter, 2017) for 5 epochs; L2-regularization strength 0.01 ; and a maximum number of tokens of 300 .\nLiving17 and Nonliving26 from BREEDS For training, we use SGD with a batch size of 128 , weight decay of $10^{-4}$, and learning rate 0.1 . Models were trained until convergence. Models were trained for a total of 450 epochs, with 10 -fold learning rate drops every 150 epochs. Note that since we want to evaluate models for novel subpopulations no pre-training was used. We train two architectures DenseNet121 and ResNet50.\nEntity13 and Entity30 from BREEDS For training, we use SGD with a batch size of 128 , weight decay of $10^{-4}$, and learning rate 0.1 . Models were trained until convergence. Models were trained for a total of 300 epochs, with 10 -fold learning rate drops every 100 epochs. Note that since we want to evaluate models for novel subpopulations no pre-training was used. We train two architectures DenseNet121 and ResNet50.\nMNIST For MNIST, we train a MLP described above with SGD with momentum 0.9 and learning rate 0.01 for 50 epochs. We use weight decay of $10^{-5}$ and batch size as 200.\nWe have a single number for CivilComments because it is a binary classification task. For multiclass problems, ATC-NE and ATC-MC can lead to different ordering of examples when ranked with the corresponding scoring function. Temperature scaling on top can further alter the ordering of examples. The changed ordering of examples yields different thresholds and different accuracy estimates. However for binary classification, the two scoring functions are the same as entropy (i.e. $p \\log (p)+(1-p) \\log (p))$ has a one-to-one mapping to the max conf for $p \\in[0,1]$. Moreover, temperature scaling also doesn't change the order of points for binary classification problems. Hence for the binary classification problems, both the scoring functions with and without temperature scaling yield the same estimates. We have made this clear in the updated draft.\nImplementation for Temperature Scaling We use temperature scaling implementation from https://github.com/kundajelab/abstention. We use validation set (the same we use to obtain ATC threshold or DOC source error estimate) to tune a single temperature parameter.\n\n# G. 1 DETAILS ON FIG. 1 (RIGHT) SETUP \n\nFor vision datasets, we train a DenseNet model with the exception of FCN model for MNIST dataset. For language datasets, we fine-tune a DistilBERT-base-uncased model. For each of these models, we use the exact same setup as described Sec. G. Importantly, to obtain errors on the same scale, we rescale all the errors by subtracting the error of Average Confidence method for each model. Results are reported as mean of the re-scaled errors over 4 seeds.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 25,
            "markdown": "# H Supplementary Results \n\n## H. 1 CIFAR PRETRAINING ABLATION\n\n![img-5.jpeg](img-5.jpeg)\n\nFigure 6: Results with a pretrained DenseNet121 model on CIFAR10. We observe similar behaviour as that with a model trained from scratch.\n\n## H. 2 BREEDS RESULTS WITH REGRESSION MODEL\n\n![img-6.jpeg](img-6.jpeg)\n\nFigure 7: Scatter plots for DOC with linear fit. Results parallel to Fig. 3(Middle) on other BREEDS dataset.\n\n| Dataset | DOC (w/o fit) | DOC (w fit) | ATC-MC (Ours) (w/o fit) |\n| :-- | :--: | :--: | :--: |\n| LIVING-17 | 24.32 | 13.65 | $\\mathbf{1 0 . 0 7}$ |\n| NONLIVING-26 | 29.91 | $\\mathbf{1 8 . 1 3}$ | 19.37 |\n| ENTITY-13 | 22.18 | 8.63 | 8.01 |\n| ENTITY-30 | 24.71 | 12.28 | $\\mathbf{1 0 . 2 1}$ |\n\nTable 5: Mean Absolute estimation Error (MAE) results for BREEDs datasets with novel populations in our setup. After fitting a robust linear model for DOC on same subpopulation, we show predicted accuracy on different subpopulations with fine-tuned DOC (i.e., DOC (w/ fit)) and compare with ATC without any regression model, i.e., ATC (w/o fit). While observe substantial improvements in MAE from DOC (w/o fit) to DOC (w/ fit), ATC (w/o fit) continues to outperform even DOC (w/ fit).",
            "images": [
                {
                    "id": "img-5.jpeg",
                    "top_left_x": 623,
                    "top_left_y": 371,
                    "bottom_right_x": 1060,
                    "bottom_right_y": 858,
                    "image_base64": "..."
                },
                {
                    "id": "img-6.jpeg",
                    "top_left_x": 294,
                    "top_left_y": 1097,
                    "bottom_right_x": 1394,
                    "bottom_right_y": 1421,
                    "image_base64": "..."
                }
            ],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 26,
            "markdown": "![img-7.jpeg](img-7.jpeg)\n\nFigure 8: Scatter plot of predicted accuracy versus (true) OOD accuracy. For vision datasets except MNIST we use a DenseNet121 model. For MNIST, we use a FCN. For language datasets, we use DistillBert-base-uncased. Results reported by aggregating accuracy numbers over 4 different seeds.",
            "images": [
                {
                    "id": "img-7.jpeg",
                    "top_left_x": 290,
                    "top_left_y": 226,
                    "bottom_right_x": 1405,
                    "bottom_right_y": 1834,
                    "image_base64": "..."
                }
            ],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 27,
            "markdown": "![img-8.jpeg](img-8.jpeg)\n\nFigure 9: Scatter plot of predicted accuracy versus (true) OOD accuracy for vision datasets except MNIST with a ResNet50 model. Results reported by aggregating MAE numbers over 4 different seeds.",
            "images": [
                {
                    "id": "img-8.jpeg",
                    "top_left_x": 290,
                    "top_left_y": 226,
                    "bottom_right_x": 1405,
                    "bottom_right_y": 1834,
                    "image_base64": "..."
                }
            ],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 28,
            "markdown": "| Dataset | Shift | IM |  | AC |  | DOC |  | GDE | ATC-MC (Ours) |  | ATC-NE (Ours) |  |\n| :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |\n|  |  | Pre T | Post T | Pre T | Post T | Pre T | Post T | Post T | Pre T | Post T | Pre T | Post T |\n| CIFAR10 | Natural | 6.60 | 5.74 | 9.88 | 6.89 | 7.25 | 6.07 | 4.77 | 3.21 | 3.02 | 2.99 | 2.85 |\n|  |  | (0.35) | (0.30) | (0.16) | (0.13) | (0.15) | (0.16) | (0.13) | (0.49) | (0.40) | (0.37) | (0.29) |\n|  | Synthetic | 12.33 | 10.20 | 16.50 | 11.91 | 13.87 | 11.08 | 6.55 | 4.65 | 4.25 | 4.21 | 3.87 |\n|  |  | (0.51) | (0.48) | (0.26) | (0.17) | (0.18) | (0.17) | (0.35) | (0.55) | (0.55) | (0.55) | (0.75) |\n| CIFAR100 | Synthetic | 13.69 | 11.51 | 23.61 | 13.10 | 14.60 | 10.14 | 9.85 | 5.50 | 4.75 | 4.72 | 4.94 |\n|  |  | (0.55) | (0.41) | (1.16) | (0.80) | (0.77) | (0.64) | (0.57) | (0.70) | (0.73) | (0.74) | (0.74) |\n| ImageNet200 | Natural | 12.37 | 8.19 | 22.07 | 8.61 | 15.17 | 7.81 | 5.13 | 4.37 | 2.04 | 3.79 | 1.45 |\n|  |  | (0.25) | (0.33) | (0.08) | (0.25) | (0.11) | (0.29) | (0.08) | (0.39) | (0.24) | (0.30) | (0.27) |\n|  | Synthetic | 19.86 | 12.94 | 32.44 | 13.35 | 25.02 | 12.38 | 5.41 | 5.93 | 3.09 | 5.00 | 2.68 |\n|  |  | (1.38) | (1.81) | (1.00) | (1.30) | (1.10) | (1.38) | (0.89) | (1.38) | (0.87) | (1.28) | (0.45) |\n| ImageNet | Natural | 7.77 | 6.50 | 18.13 | 6.02 | 8.13 | 5.76 | 6.23 | 3.88 | 2.17 | 2.06 | 0.80 |\n|  |  | (0.27) | (0.33) | (0.23) | (0.34) | (0.27) | (0.37) | (0.41) | (0.53) | (0.62) | (0.54) | (0.44) |\n|  | Synthetic | 13.39 | 10.12 | 24.62 | 8.51 | 13.55 | 7.90 | 6.32 | 3.34 | 2.53 | 2.61 | 4.89 |\n|  |  | (0.53) | (0.63) | (0.64) | (0.71) | (0.61) | (0.72) | (0.33) | (0.53) | (0.36) | (0.33) | (0.83) |\n| FMoW-WILDS | Natural | 5.53 | 4.31 | 33.53 | 12.84 | 5.94 | 4.45 | 5.74 | 3.06 | 2.70 | 3.02 | 2.72 |\n|  |  | (0.33) | (0.63) | (0.13) | (12.06) | (0.36) | (0.77) | (0.55) | (0.36) | (0.54) | (0.35) | (0.44) |\n| RxRx1-WILDS | Natural | 5.80 | 5.72 | 7.90 | 4.84 | 5.98 | 5.98 | 6.03 | 4.66 | 4.56 | 4.41 | 4.47 |\n|  |  | (0.17) | (0.15) | (0.24) | (0.09) | (0.15) | (0.13) | (0.08) | (0.38) | (0.38) | (0.31) | (0.26) |\n| Amazon-WILDS | Natural | 2.40 | 2.29 | 8.01 | 2.38 | 2.40 | 2.28 | 17.87 | 1.65 | 1.62 | 1.60 | 1.59 |\n|  |  | (0.08) | (0.09) | (0.53) | (0.17) | (0.09) | (0.09) | (0.18) | (0.06) | (0.05) | (0.14) | (0.15) |\n| CivilCom.-WILDS | Natural | 12.64 | 10.80 | 16.76 | 11.03 | 13.31 | 10.99 | 16.65 |  | 7.14 |  |  |\n|  |  | (0.52) | (0.48) | (0.53) | (0.49) | (0.52) | (0.49) | (0.25) |  | (0.41) |  |  |\n| MNIST | Natural | 18.48 | 15.99 | 21.17 | 14.81 | 20.19 | 14.56 | 24.42 | 5.02 | 2.40 | 3.14 | 3.50 |\n|  |  | (0.45) | (1.53) | (0.24) | (3.89) | (0.23) | (3.47) | (0.41) | (0.44) | (1.83) | (0.49) | (0.17) |\n| ENTITY-13 | Same | 16.23 | 11.14 | 24.97 | 10.88 | 19.08 | 10.47 | 10.71 | 5.39 | 3.88 | 4.58 | 4.19 |\n|  |  | (0.77) | (0.65) | (0.70) | (0.77) | (0.65) | (0.72) | (0.74) | (0.92) | (0.61) | (0.85) | (0.16) |\n|  | Novel | 28.53 | 22.02 | 38.33 | 21.64 | 32.43 | 21.22 | 20.61 | 13.58 | 10.28 | 12.25 | 6.63 |\n|  |  | (0.82) | (0.68) | (0.75) | (0.86) | (0.69) | (0.80) | (0.60) | (1.15) | (1.34) | (1.21) | (0.93) |\n| ENTITY-30 | Same | 18.59 | 14.46 | 28.82 | 14.30 | 21.63 | 13.46 | 12.92 | 9.12 | 7.75 | 8.15 | 7.64 |\n|  |  | (0.51) | (0.52) | (0.43) | (0.71) | (0.37) | (0.59) | (0.14) | (0.62) | (0.72) | (0.68) | (0.88) |\n|  | Novel | 32.34 | 26.85 | 44.02 | 26.27 | 36.82 | 25.42 | 23.16 | 17.75 | 14.30 | 15.60 | 10.57 |\n|  |  | (0.60) | (0.58) | (0.56) | (0.79) | (0.47) | (0.68) | (0.12) | (0.76) | (0.85) | (0.86) | (0.86) |\n| NONLIVING-26 | Same | 18.66 | 17.17 | 26.39 | 16.14 | 19.86 | 15.58 | 16.63 | 10.87 | 10.24 | 10.07 | 10.26 |\n|  |  | (0.76) | (0.74) | (0.82) | (0.81) | (0.67) | (0.76) | (0.45) | (0.98) | (0.83) | (0.92) | (1.18) |\n|  | Novel | 33.43 | 31.53 | 41.66 | 29.87 | 35.13 | 29.31 | 29.56 | 21.70 | 20.12 | 19.08 | 18.26 |\n|  |  | (0.67) | (0.65) | (0.67) | (0.71) | (0.54) | (0.64) | (0.21) | (0.86) | (0.75) | (0.82) | (1.12) |\n| LIVING-17 | Same | 12.63 | 11.05 | 18.32 | 10.46 | 14.43 | 10.14 | 9.87 | 4.57 | 3.95 | 3.81 | 4.21 |\n|  |  | (1.25) | (1.20) | (1.01) | (1.12) | (1.11) | (1.16) | (0.61) | (0.71) | (0.48) | (0.22) | (0.53) |\n|  | Novel | 29.03 | 26.96 | 35.67 | 26.11 | 31.73 | 25.73 | 23.53 | 16.15 | 14.49 | 12.97 | 11.39 |\n|  |  | (1.44) | (1.38) | (1.09) | (1.27) | (1.19) | (1.35) | (0.52) | (1.36) | (1.46) | (1.52) | (1.72) |\n\nTable 3: Mean Absolute estimation Error (MAE) results for different datasets in our setup grouped by the nature of shift. 'Same' refers to same subpopulation shifts and 'Novel' refers novel subpopulation shifts. We include details about the target sets considered in each shift in Table 2. Post T denotes use of TS calibration on source. For language datasets, we use DistilBERT-base-uncased, for vision dataset we report results with DenseNet model with the exception of MNIST where we use FCN. Across all datasets, we observe that ATC achieves superior performance (lower MAE is better). For GDE post T and pre T estimates match since TS doesn't alter the argmax prediction. Results reported by aggregating MAE numbers over 4 different seeds. Values in parenthesis (i.e., $(\\cdot)$ ) denote standard deviation values.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        },
        {
            "index": 29,
            "markdown": "| Dataset | Shift | IM |  | AC |  | DOC |  | GDE | ATC-MC (Ours) |  | ATC-NE (Ours) |  |\n| :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |\n|  |  | Pre T | Post T | Pre T | Post T | Pre T | Post T | Post T | Pre T | Post T | Pre T | Post T |\n| CIFAR10 | Natural | 7.14 | 6.20 | 10.25 | 7.06 | 7.68 | 6.35 | 5.74 | 4.02 | 3.85 | 3.76 | 3.38 |\n|  |  | (0.14) | (0.11) | (0.31) | (0.33) | (0.28) | (0.27) | (0.25) | (0.38) | (0.30) | (0.33) | (0.32) |\n|  | Synthetic | 12.62 | 10.75 | 16.50 | 11.91 | 13.93 | 11.20 | 7.97 | 5.66 | 5.03 | 4.87 | 3.63 |\n|  |  | (0.76) | (0.71) | (0.28) | (0.24) | (0.29) | (0.28) | (0.13) | (0.64) | (0.71) | (0.71) | (0.62) |\n| CIFAR100 | Synthetic | 12.77 | 12.34 | 16.89 | 12.73 | 11.18 | 9.63 | 12.00 | 5.61 | 5.55 | 5.65 | 5.76 |\n|  |  | (0.43) | (0.68) | (0.20) | (2.59) | (0.35) | (1.25) | (0.48) | (0.51) | (0.55) | (0.35) | (0.27) |\n| ImageNet200 | Natural | 12.63 | 7.99 | 23.08 | 7.22 | 15.40 | 6.33 | 5.00 | 4.60 | 1.80 | 4.06 | 1.38 |\n|  |  | (0.59) | (0.47) | (0.31) | (0.22) | (0.42) | (0.24) | (0.36) | (0.63) | (0.17) | (0.69) | (0.29) |\n|  | Synthetic | 20.17 | 11.74 | 33.69 | 9.51 | 25.49 | 8.61 | 4.19 | 5.37 | 2.78 | 4.53 | 3.58 |\n|  |  | (0.74) | (0.80) | (0.73) | (0.51) | (0.66) | (0.50) | (0.14) | (0.88) | (0.23) | (0.79) | (0.33) |\n| ImageNet | Natural | 8.09 | 6.42 | 21.66 | 5.91 | 8.53 | 5.21 | 5.90 | 3.93 | 1.89 | 2.45 | 0.73 |\n|  |  | (0.25) | (0.28) | (0.38) | (0.22) | (0.26) | (0.25) | (0.44) | (0.26) | (0.21) | (0.16) | (0.10) |\n|  | Synthetic | 13.93 | 9.90 | 28.05 | 7.56 | 13.82 | 6.19 | 6.70 | 3.33 | 2.55 | 2.12 | 5.06 |\n|  |  | (0.14) | (0.23) | (0.39) | (0.13) | (0.31) | (0.07) | (0.52) | (0.25) | (0.25) | (0.31) | (0.27) |\n| FMoW-WILDS | Natural | 5.15 | 3.55 | 34.64 | 5.03 | 5.58 | 3.46 | 5.08 | 2.59 | 2.33 | 2.52 | 2.22 |\n|  |  | (0.19) | (0.41) | (0.22) | (0.29) | (0.17) | (0.37) | (0.46) | (0.32) | (0.28) | (0.25) | (0.30) |\n| RxRx1-WILDS | Natural | 6.17 | 6.11 | 21.05 | 5.21 | 6.54 | 6.27 | 6.82 | 5.30 | 5.20 | 5.19 | 5.63 |\n|  |  | (0.20) | (0.24) | (0.31) | (0.18) | (0.21) | (0.20) | (0.31) | (0.30) | (0.44) | (0.43) | (0.55) |\n| Entity-13 | Same | 18.32 | 14.38 | 27.79 | 13.56 | 20.50 | 13.22 | 16.09 | 9.35 | 7.50 | 7.80 | 6.94 |\n|  |  | (0.29) | (0.53) | (1.18) | (0.58) | (0.47) | (0.58) | (0.84) | (0.79) | (0.65) | (0.62) | (0.71) |\n|  | Novel | 28.82 | 24.03 | 38.97 | 22.96 | 31.66 | 22.61 | 25.26 | 17.11 | 13.96 | 14.75 | 9.94 |\n|  |  | (0.30) | (0.55) | (1.32) | (0.59) | (0.54) | (0.58) | (1.08) | (0.93) | (0.64) | (0.78) |  |\n| Entity-30 | Same | 16.91 | 14.61 | 26.84 | 14.37 | 18.60 | 13.11 | 13.74 | 8.54 | 7.94 | 7.77 | 8.04 |\n|  |  | (1.33) | (1.11) | (2.15) | (1.34) | (1.69) | (1.30) | (1.07) | (1.47) | (1.38) | (1.44) | (1.51) |\n|  | Novel | 28.66 | 25.83 | 39.21 | 25.03 | 30.95 | 23.73 | 23.15 | 15.57 | 13.24 | 12.44 | 11.05 |\n|  |  | (1.16) | (0.88) | (2.03) | (1.11) | (1.64) | (1.11) | (0.51) | (1.44) | (1.15) | (1.26) | (1.13) |\n| NonLIVING-26 | Same | 17.43 | 15.95 | 27.70 | 15.40 | 18.06 | 14.58 | 16.99 | 10.79 | 10.13 | 10.05 | 10.29 |\n|  |  | (0.90) | (0.86) | (0.90) | (0.69) | (1.00) | (0.78) | (1.25) | (0.62) | (0.32) | (0.46) | (0.79) |\n|  | Novel | 29.51 | 27.75 | 40.02 | 26.77 | 30.36 | 25.93 | 27.70 | 19.64 | 17.75 | 16.90 | 15.69 |\n|  |  | (0.86) | (0.82) | (0.76) | (0.82) | (0.95) | (0.80) | (1.42) | (0.68) | (0.53) | (0.60) | (0.83) |\n| LIVING-17 | Same | 14.28 | 12.21 | 23.46 | 11.16 | 15.22 | 10.78 | 10.49 | 4.92 | 4.23 | 4.19 | 4.73 |\n|  |  | (0.96) | (0.93) | (1.16) | (0.90) | (0.96) | (0.99) | (0.97) | (0.57) | (0.42) | (0.35) | (0.24) |\n|  | Novel | 28.91 | 26.35 | 38.62 | 24.91 | 30.32 | 24.52 | 22.49 | 15.42 | 13.02 | 12.29 | 10.34 |\n|  |  | (0.66) | (0.73) | (1.01) | (0.61) | (0.59) | (0.74) | (0.85) | (0.59) | (0.53) | (0.73) | (0.62) |\n\nTable 4: Mean Absolute estimation Error (MAE) results for different datasets in our setup grouped by the nature of shift for ResNet model. 'Same' refers to same subpopulation shifts and 'Novel' refers novel subpopulation shifts. We include details about the target sets considered in each shift in Table 2. Post T denotes use of TS calibration on source. Across all datasets, we observe that ATC achieves superior performance (lower MAE is better). For GDE post T and pre T estimates match since TS doesn't alter the argmax prediction. Results reported by aggregating MAE numbers over 4 different seeds. Values in parenthesis (i.e., $(\\cdot)$ ) denote standard deviation values.",
            "images": [],
            "dimensions": {
                "dpi": 200,
                "height": 2200,
                "width": 1700
            }
        }
    ],
    "model": "mistral-ocr-2503-completion",
    "usage_info": {
        "pages_processed": 29,
        "doc_size_bytes": null
    }
}
```
</details>

### OCR with uploaded PDF

You can also upload a PDF file and get the OCR results from the uploaded PDF. 

#### Upload a file
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
from mistralai import Mistral
import os

api_key = os.environ["MISTRAL_API_KEY"]

client = Mistral(api_key=api_key)

uploaded_pdf = client.files.upload(
    file={
        "file_name": "uploaded_file.pdf",
        "content": open("uploaded_file.pdf", "rb"),
    },
    purpose="ocr"
)  
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
import { Mistral } from '@mistralai/mistralai';
import fs from 'fs';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

const uploadedFile = fs.readFileSync('uploaded_file.pdf');
const uploadedPdf = await client.files.upload({
    file: {
        fileName: "uploaded_file.pdf",
        content: uploadedFile,
    },
    purpose: "ocr"
});
```
  </TabItem>
  
  <TabItem value="curl" label="curl">

```bash
curl https://api.mistral.ai/v1/files \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -F purpose="ocr" \
  -F file="@uploaded_file.pdf"
```
  </TabItem>

</Tabs>

#### Retrieve File
<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
retrieved_file = client.files.retrieve(file_id=uploaded_pdf.id)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
const retrievedFile = await client.files.retrieve({
    fileId: uploadedPdf.id
});
```
  </TabItem>
  
  <TabItem value="curl" label="curl">

```bash
curl -X GET "https://api.mistral.ai/v1/files/$id" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer $MISTRAL_API_KEY"
```

  </TabItem>

</Tabs>

```
id='00edaf84-95b0-45db-8f83-f71138491f23' object='file' size_bytes=3749788 created_at=1741023462 filename='uploaded_file.pdf' purpose='ocr' sample_type='ocr_input' source='upload' deleted=False num_lines=None
```

#### Get signed URL
<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
signed_url = client.files.get_signed_url(file_id=uploaded_pdf.id)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
const signedUrl = await client.files.getSignedUrl({
    fileId: uploadedPdf.id,
});
```
  </TabItem>
  
  <TabItem value="curl" label="curl">

```bash
curl -X GET "https://api.mistral.ai/v1/files/$id/url?expiry=24" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer $MISTRAL_API_KEY"
```

  </TabItem>

</Tabs>

#### Get OCR results

<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
import os
from mistralai import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key)

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "document_url",
        "document_url": signed_url.url,
    },
    include_image_base64=True
)
```

  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

const ocrResponse = await client.ocr.process({
    model: "mistral-ocr-latest",
    document: {
        type: "document_url",
        documentUrl: signedUrl.url,
    },
    includeImageBase64: true
});
```
  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl https://api.mistral.ai/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
        "type": "document_url",
        "document_url": "<signed_url>"
    },
    "include_image_base64": true
  }' -o ocr_output.json
```
  </TabItem>
</Tabs>

### OCR with image

<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
import os
from mistralai import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key)

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "image_url",
        "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png"
    },
    include_image_base64=True
)
```

Or passing a Base64 encoded image:
```python
import base64
import os
from mistralai import Mistral

def encode_image(image_path):
    """Encode the image to base64."""
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: The file {image_path} was not found.")
        return None
    except Exception as e:  # Added general exception handling
        print(f"Error: {e}")
        return None

# Path to your image
image_path = "path_to_your_image.jpg"

# Getting the base64 string
base64_image = encode_image(image_path)

api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key)

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "image_url",
        "image_url": f"data:image/jpeg;base64,{base64_image}" 
    },
    include_image_base64=True
)
```

  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

const ocrResponse = await client.ocr.process({
    model: "mistral-ocr-latest",
    document: {
        type: "image_url",
        imageUrl: "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
    },
    includeImageBase64: true
});
```

Or passing a Base64 encoded image:
```ts
import { Mistral } from '@mistralai/mistralai';
import fs from 'fs';

async function encodeImage(imagePath) {
    try {
        // Read the image file as a buffer
        const imageBuffer = fs.readFileSync(imagePath);

        // Convert the buffer to a Base64-encoded string
        const base64Image = imageBuffer.toString('base64');
        return base64Image;
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

const imagePath = "path_to_your_image.jpg";

const base64Image = await encodeImage(imagePath);

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

try {
    const ocrResponse = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
            type: "image_url",
            imageUrl: "data:image/jpeg;base64," + base64Image
        },
        includeImageBase64: true
    });
    console.log(ocrResponse);
} catch (error) {
    console.error("Error processing OCR:", error);
}
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl https://api.mistral.ai/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
        "type": "image_url",
        "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png"
    },
    "include_image_base64": true
  }' -o ocr_output.json
```

Or passing a Base64 encoded image:
```bash
curl https://api.mistral.ai/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
        "type": "image_url",
        "image_url": "data:image/jpeg;base64,<base64_image>"
    },
    "include_image_base64": true
  }' -o ocr_output.json
```

  </TabItem>
</Tabs>

## Cookbooks
For more information and guides on how to make use of OCR, we have the following cookbooks:
- [Tool Use](https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/ocr/tool_usage.ipynb)
- [Batch OCR](https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/ocr/batch_ocr.ipynb)

## FAQ
**Q: Are there any limits regarding the OCR API?**\
A: Yes, there are certain limitations for the OCR API. Uploaded document files must not exceed 50 MB in size and should be no longer than 1,000 pages.
