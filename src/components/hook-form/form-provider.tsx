import { FormProvider as Form, UseFormReturn, FieldValues } from "react-hook-form";

// ----------------------------------------------------------------------

interface Props<TFieldValues extends FieldValues = FieldValues> {
  children: React.ReactNode;
  methods: UseFormReturn<TFieldValues>;
  onSubmit?: (data: TFieldValues) => void;
}

export default function FormProvider<TFieldValues extends FieldValues = FieldValues>({
  children,
  onSubmit,
  methods,
}: Props<TFieldValues>) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit ? methods.handleSubmit(onSubmit) : undefined}>{children}</form>
    </Form>
  );
}
