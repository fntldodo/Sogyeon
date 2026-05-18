"use client";

import { useMemo, useState } from "react";
import {
  BottomActions,
  FilterChip,
  FlowSidebar,
  OptionCard,
  OptionGrid,
  RegionInputs,
  ReportPanel,
  StepHeader
} from "./components";
import {
  cashPaymentOptions,
  consultationSubmitErrorMessage,
  emptyConsultationFormValues,
  emptyValues,
  freezerSupportOptions,
  posKioskDetailOptions,
  posKioskTypeOptions,
  regionFields,
  sogyeonCodeHelp,
  sogyeonCodeOptions,
  startupTypeOptions,
  steps,
  storeFormatOptions,
  storeStatusOptions,
  supplyTypeOptions
} from "./constants";
import { ConsultationCompletePanel, ConsultationFormPanel } from "./form-components";
import type { ConsultationFormErrors, ConsultationFormValues, FlowValues, StartupType, StepId } from "./types";
import { createConsultationRequestPayload, createInternalConsultationSummary, createReportSections } from "./utils";
import type { ConsultationApiSuccessResponse } from "../../lib/consultation/types";

function isConsultationApiSuccessResponse(value: unknown): value is ConsultationApiSuccessResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "ok" in value &&
    value.ok === true &&
    "request_id" in value &&
    typeof value.request_id === "string" &&
    value.request_id.length > 0
  );
}

export default function FlowPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [values, setValues] = useState<FlowValues>(emptyValues);
  const [consultationValues, setConsultationValues] =
    useState<ConsultationFormValues>(emptyConsultationFormValues);
  const [consultationErrors, setConsultationErrors] = useState<ConsultationFormErrors>({});
  const [consultationSubmitError, setConsultationSubmitError] = useState<string | null>(null);
  const [isSubmittingConsultation, setIsSubmittingConsultation] = useState(false);
  const [savedRequestId, setSavedRequestId] = useState<string | null>(null);
  const step = steps[activeIndex];
  const progress = Math.round(((activeIndex + 1) / steps.length) * 100);

  const currentStoreFormatOptions = useMemo(() => {
    if (!values.startup_type) {
      return [];
    }

    return storeFormatOptions[values.startup_type];
  }, [values.startup_type]);

  const fallbackStoreFormatOptions = useMemo(
    () => Array.from(new Set(startupTypeOptions.flatMap((startupType) => storeFormatOptions[startupType]))),
    []
  );

  const reportSections = useMemo(() => createReportSections(values), [values]);
  const internalSummaryText = useMemo(
    () => createInternalConsultationSummary(values, consultationValues),
    [values, consultationValues]
  );

  const updateValue = <Key extends keyof FlowValues>(key: Key, value: FlowValues[Key]) => {
    setValues((current) => ({
      ...current,
      [key]: value
    }));
  };

  const updateConsultationValue = <Key extends keyof ConsultationFormValues>(
    key: Key,
    value: ConsultationFormValues[Key]
  ) => {
    setConsultationValues((current) => ({
      ...current,
      [key]: value
    }));
    setConsultationErrors((current) => ({
      ...current,
      [key]: undefined
    }));
    setConsultationSubmitError(null);
  };

  const goToStep = (stepId: StepId) => {
    const nextIndex = steps.findIndex((item) => item.id === stepId);

    if (nextIndex >= 0) {
      setActiveIndex(nextIndex);
    }
  };

  const validateConsultationForm = () => {
    const nextErrors: ConsultationFormErrors = {};
    const trimmedName = consultationValues.customer_name.trim();
    const trimmedPhone = consultationValues.phone.trim();

    if (!trimmedName) {
      nextErrors.customer_name = "이름 또는 신청자명을 입력해주세요.";
    }

    if (!trimmedPhone) {
      nextErrors.phone = "연락처를 입력해주세요.";
    } else if (trimmedPhone.length < 8) {
      nextErrors.phone = "연락처는 8자 이상으로 입력해주세요.";
    }

    if (!consultationValues.privacy_agreed) {
      nextErrors.privacy_agreed = "개인정보 및 상담 전달 동의가 필요합니다.";
    }

    setConsultationErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitConsultationForm = async () => {
    if (isSubmittingConsultation) {
      return;
    }

    setConsultationSubmitError(null);

    if (!validateConsultationForm()) {
      return;
    }

    const nextConsultationValues = {
      ...consultationValues,
      customer_name: consultationValues.customer_name.trim(),
      phone: consultationValues.phone.trim(),
      memo: consultationValues.memo.trim()
    };
    const nextInternalSummaryText = createInternalConsultationSummary(values, nextConsultationValues);
    const payload = createConsultationRequestPayload(values, nextConsultationValues, nextInternalSummaryText);

    setIsSubmittingConsultation(true);
    setSavedRequestId(null);

    try {
      const response = await fetch("/api/consultation-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const responseBody: unknown = await response.json().catch(() => null);

      if (!response.ok || !isConsultationApiSuccessResponse(responseBody)) {
        setConsultationSubmitError(consultationSubmitErrorMessage);
        return;
      }

      setConsultationValues(nextConsultationValues);
      setSavedRequestId(responseBody.request_id);
      goToStep("consultation-complete");
    } catch {
      setConsultationSubmitError(consultationSubmitErrorMessage);
    } finally {
      setIsSubmittingConsultation(false);
    }
  };

  const selectStartupType = (startupType: StartupType) => {
    setValues((current) => ({
      ...current,
      startup_type: startupType,
      store_format: ""
    }));
  };

  const togglePosKioskOption = (option: string) => {
    setValues((current) => {
      const exists = current.pos_kiosk_options.includes(option);
      return {
        ...current,
        pos_kiosk_options: exists
          ? current.pos_kiosk_options.filter((item) => item !== option)
          : [...current.pos_kiosk_options, option]
      };
    });
  };

  const goPrevious = () => {
    if (activeIndex === 0) {
      return;
    }

    setActiveIndex((current) => current - 1);
  };

  const goNext = () => {
    if (step.id === "consultation-form") {
      void submitConsultationForm();
      return;
    }

    if (activeIndex === steps.length - 1) {
      return;
    }

    setActiveIndex((current) => current + 1);
  };

  const resetFlow = () => {
    setValues(emptyValues);
    setConsultationValues(emptyConsultationFormValues);
    setConsultationErrors({});
    setConsultationSubmitError(null);
    setIsSubmittingConsultation(false);
    setSavedRequestId(null);
    setActiveIndex(0);
  };

  const getNextLabel = () => {
    if (step.id === "consultation-form") {
      return isSubmittingConsultation ? "저장 중..." : "상담 요청서 제출하기";
    }

    return "다음 단계";
  };

  const storeFormatChoices =
    currentStoreFormatOptions.length > 0 ? currentStoreFormatOptions : fallbackStoreFormatOptions;

  return (
    <main className="min-h-screen overflow-x-hidden bg-paper px-3 py-3 sm:px-8 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] w-full min-w-0 max-w-5xl gap-3 sm:gap-4 lg:grid-cols-[260px_1fr] lg:gap-5">
        <FlowSidebar activeIndex={activeIndex} progress={progress} steps={steps} onStepSelect={setActiveIndex} />

        <section className="min-w-0 rounded-lg border border-line bg-white shadow-soft">
          <StepHeader activeIndex={activeIndex} progress={progress} step={step} totalSteps={steps.length} />

          <div className="p-4 pb-36 sm:p-7 sm:pb-7">
            {step.id === "startup-type" ? (
              <OptionGrid>
                {startupTypeOptions.map((option) => (
                  <OptionCard
                    key={option}
                    label={option}
                    selected={values.startup_type === option}
                    onClick={() => selectStartupType(option)}
                  />
                ))}
              </OptionGrid>
            ) : null}

            {step.id === "region" ? (
              <RegionInputs
                fields={regionFields}
                values={values}
                onChange={(key, value) => updateValue(key, value)}
              />
            ) : null}

            {step.id === "store-status" ? (
              <OptionGrid>
                {storeStatusOptions.map((option) => (
                  <OptionCard
                    key={option}
                    label={option}
                    selected={values.store_status === option}
                    onClick={() => updateValue("store_status", option)}
                  />
                ))}
              </OptionGrid>
            ) : null}

            {step.id === "store-format" ? (
              <div className="grid gap-4">
                {!values.startup_type ? (
                  <div className="rounded-lg border border-line bg-paper p-4">
                    <p className="text-sm font-bold leading-6 text-muted">
                      창업 종류를 먼저 선택하면 매장 형태 선택지가 좁혀집니다.
                    </p>
                  </div>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2">
                  {storeFormatChoices.map((option) => (
                    <OptionCard
                      key={option}
                      label={option}
                      selected={values.store_format === option}
                      onClick={() => updateValue("store_format", option)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {step.id === "pos-kiosk" ? (
              <div className="grid gap-5">
                <div className="grid gap-3">
                  <h2 className="text-base font-extrabold text-ink">1차 선택</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {posKioskTypeOptions.map((option) => (
                      <OptionCard
                        key={option}
                        label={option}
                        selected={values.pos_kiosk_type === option}
                        onClick={() => updateValue("pos_kiosk_type", option)}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid gap-3">
                  <div>
                    <h2 className="text-base font-extrabold text-ink">많이 선택해요 옵션</h2>
                    <p className="mt-1 text-sm font-semibold leading-6 text-muted">
                      필요한 항목을 여러 개 선택할 수 있습니다.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {posKioskDetailOptions.map((option) => (
                      <FilterChip
                        key={option}
                        label={option}
                        selected={values.pos_kiosk_options.includes(option)}
                        onClick={() => togglePosKioskOption(option)}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid gap-3">
                  <h2 className="text-base font-extrabold text-ink">현금 결제</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {cashPaymentOptions.map((option) => (
                      <OptionCard
                        key={option}
                        label={option}
                        selected={values.cash_payment_type === option}
                        onClick={() => updateValue("cash_payment_type", option)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {step.id === "sogyeon-code" ? (
              <OptionGrid>
                {sogyeonCodeOptions.map((option) => (
                  <OptionCard
                    key={option}
                    label={option}
                    helperText={sogyeonCodeHelp[option]}
                    selected={values.sogyeon_code_choice === option}
                    onClick={() => updateValue("sogyeon_code_choice", option)}
                  />
                ))}
              </OptionGrid>
            ) : null}

            {step.id === "supply-type" ? (
              <OptionGrid>
                {supplyTypeOptions.map((option) => (
                  <OptionCard
                    key={option}
                    label={option}
                    selected={values.supply_type === option}
                    onClick={() => updateValue("supply_type", option)}
                  />
                ))}
              </OptionGrid>
            ) : null}

            {step.id === "freezer-support" ? (
              <OptionGrid>
                {freezerSupportOptions.map((option) => (
                  <OptionCard
                    key={option}
                    label={option}
                    selected={values.freezer_support_status === option}
                    onClick={() => updateValue("freezer_support_status", option)}
                  />
                ))}
              </OptionGrid>
            ) : null}

            {step.id === "report" ? (
              <ReportPanel
                sections={reportSections}
                onConsultationStart={() => goToStep("consultation-form")}
              />
            ) : null}

            {step.id === "consultation-form" ? (
              <ConsultationFormPanel
                values={consultationValues}
                errors={consultationErrors}
                isSubmitting={isSubmittingConsultation}
                submitError={consultationSubmitError}
                onChange={updateConsultationValue}
              />
            ) : null}

            {step.id === "consultation-complete" ? (
              <ConsultationCompletePanel
                formValues={consultationValues}
                internalSummaryText={internalSummaryText}
                reportSections={reportSections}
                requestId={savedRequestId}
              />
            ) : null}

            <BottomActions
              activeIndex={activeIndex}
              totalSteps={steps.length}
              nextLabel={getNextLabel()}
              showNext={step.id !== "report" && step.id !== "consultation-complete"}
              nextDisabled={isSubmittingConsultation}
              onPrevious={goPrevious}
              onNext={goNext}
              onReset={resetFlow}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
