import {
  OperationProps,
  OperationSecuritySectionProps,
  OperationParametersSectionProps,
  OperationRequestBodySectionProps,
  OperationTitleSectionProps,
  OperationSummarySectionProps,
  OperationDescriptionSectionProps,
  OperationResponseBodyDisplayTypeSectionProps,
  useChildren,
  OperationResponseBodySectionProps,
} from '@speakeasy-api/docs-md-react';
import React from 'react';
import { ArrowDownIcon } from '@/components/icons/pixel';
import { SummaryCard } from './components/summary-card';
import { OperationWrapper } from '../layout/operation-wrapper';
import { OperationResponseBodyDescriptionSection } from './response-body';

export function Operation({ children }: OperationProps) {
  const titleSection = useChildren<OperationTitleSectionProps>(
    children,
    'title'
  )[0];
  const summarySection = useChildren<OperationSummarySectionProps>(
    children,
    'summary'
  )[0];
  const descriptionSection = useChildren(children, 'description')[0];
  const tryItNowSection = useChildren(children, 'code-samples')[0];
  const securitySection = useChildren(children, 'security')[0];
  const parametersSection = useChildren(children, 'parameters')[0];
  const requestBodySection = useChildren(children, 'request-body')[0];
  const responseBodySection = useChildren<OperationResponseBodySectionProps>(
    children,
    'response-body'
  )[0];
  const responseBodyExamplesSection = useChildren(
    children,
    'response-body-examples'
  )[0];

  return (
    <>
      <OperationWrapper>
        <div className="api-desktop:border-r api-desktop:border-r-border border-dashed flex flex-col gap-8 px-api-operation-content">
          <SummaryCard
            summarySection={summarySection}
            titleSection={titleSection}
          />
          {descriptionSection && (
            <div
              data-type="operation-description"
              className="text-base text-muted-foreground mb-4"
            >
              {descriptionSection}
            </div>
          )}
          {securitySection && (
            <div data-type="operation-security">{securitySection}</div>
          )}
          {parametersSection && (
            <div data-type="operation-parameters">{parametersSection}</div>
          )}
          {requestBodySection && (
            <div data-type="operation-request-body">{requestBodySection}</div>
          )}
          {responseBodySection && (
            <div data-type="operation-response-body">{responseBodySection}</div>
          )}
        </div>
        <div className="flex flex-col">
          <div className="h-64 relative flex flex-col items-center justify-center api-desktop:hidden ">
            <ExamplesHeadingMobileSection />
          </div>
          <div className="relative pb-api-operation-response px-api-operation-response flex flex-col gap-6 flex-1">
            <div className="flex flex-col gap-6 sticky top-[calc(var(--header)+2rem)] overflow-y-auto">
              <div className="flex-1">{tryItNowSection ?? <div></div>}</div>
              {responseBodyExamplesSection ? (
                <div className="shrink-0 min-h-64">
                  {responseBodyExamplesSection}
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </OperationWrapper>
    </>
  );
}

export function OperationTitleSection({
  children,
}: OperationTitleSectionProps) {
  return <>{children}</>;
}

export function OperationSummarySection({
  children,
}: OperationSummarySectionProps) {
  return <>{children}</>;
}

export function OperationDescriptionSection({
  children,
}: OperationDescriptionSectionProps) {
  return <>{children}</>;
}

export function OperationParametersSection({
  children,
}: OperationParametersSectionProps) {
  return <div data-type="operation-parameters">{children}</div>;
}

export function OperationRequestBodySection({
  children,
}: OperationRequestBodySectionProps) {
  return <div data-type="operation-request-body">{children}</div>;
}

export function OperationResponseBodyDisplayTypeSection({
  children,
}: OperationResponseBodyDisplayTypeSectionProps) {
  return (
    <div className="mb-8">
      <OperationResponseBodyDescriptionSection slot="response-body-description">
        Response Type
      </OperationResponseBodyDescriptionSection>
      {children}
    </div>
  );
}

export function OperationSecuritySection({
  children,
}: OperationSecuritySectionProps) {
  return <div className="mt-6">{children}</div>;
}

function ExamplesHeadingMobileSection() {
  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 w-full h-full flex flex-col items-center justify-center">
        <span className="flex-1 bg-secondary/80 w-full" />
        <span className="flex-1 bg-secondary/60 w-full" />
        <span className="flex-1 bg-secondary/30 w-full" />
        <span className="flex-1 bg-secondary/20 w-full" />
        <span className="flex-1 bg-secondary/10 w-full" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-1">
          <h4 className="text-2xl font-bold text-foreground">Playground</h4>
          <p className="text-sm text-muted-foreground">
            Test the endpoints{' '}
            <strong className="text-foreground/50">live</strong>
          </p>
        </div>
        <ArrowDownIcon className="size-12 text-foreground/50" />
      </div>
    </>
  );
}
