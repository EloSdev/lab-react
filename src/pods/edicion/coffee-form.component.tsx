import { useForm } from "@tanstack/react-form";
import { coffeeSchema } from "../../core/coffees/coffee.schema";
import type { CoffeeInput } from "../../core/coffees/model";

interface CoffeeFormProps {
  initialValues?: CoffeeInput;
  onSubmit: (input: CoffeeInput) => Promise<void>;
}

const emptyCoffee: CoffeeInput = {
  name: "",
  origin: "",
  roast: "medium",
  price: 0,
  notes: "",
};

interface FieldMeta {
  isTouched: boolean;
  errors: ({ message: string } | undefined)[];
}

// Sólo enseñamos el error de un campo cuando la persona ya lo ha tocado
// (al enviar, TanStack Form marca todos los campos como tocados).
function visibleError(meta: FieldMeta): string | undefined {
  return meta.isTouched ? meta.errors[0]?.message : undefined;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-red-700">
      {message}
    </p>
  );
}

export function CoffeeForm({ initialValues, onSubmit }: CoffeeFormProps) {
  const form = useForm({
    defaultValues: initialValues ?? emptyCoffee,
    validators: { onChange: coffeeSchema, onSubmit: coffeeSchema },
    onSubmit: async ({ value }) => {
      // parse devuelve los valores ya limpios (con trim aplicado y sin campos de más, como el id).
      await onSubmit(coffeeSchema.parse(value));
    },
  });

  return (
    <form
      noValidate
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="name">
        {(field) => {
          const error = visibleError(field.state.meta);
          return (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name}>Nombre</label>
              <input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${field.name}-error` : undefined}
              />
              <FieldError id={`${field.name}-error`} message={error} />
            </div>
          );
        }}
      </form.Field>

      <form.Field name="origin">
        {(field) => {
          const error = visibleError(field.state.meta);
          return (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name}>Origen</label>
              <input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${field.name}-error` : undefined}
              />
              <FieldError id={`${field.name}-error`} message={error} />
            </div>
          );
        }}
      </form.Field>

      <form.Field name="roast">
        {(field) => {
          const error = visibleError(field.state.meta);
          return (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name}>Tueste</label>
              <select
                id={field.name}
                className="rounded border border-slate-400 bg-white p-2"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value as CoffeeInput["roast"])
                }
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${field.name}-error` : undefined}
              >
                <option value="light">Claro</option>
                <option value="medium">Medio</option>
                <option value="dark">Oscuro</option>
              </select>
              <FieldError id={`${field.name}-error`} message={error} />
            </div>
          );
        }}
      </form.Field>

      <form.Field name="price">
        {(field) => {
          const error = visibleError(field.state.meta);
          return (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name}>Precio (€)</label>
              <input
                id={field.name}
                type="number"
                step="0.01"
                value={Number.isNaN(field.state.value) ? "" : field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.valueAsNumber)
                }
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${field.name}-error` : undefined}
              />
              <FieldError id={`${field.name}-error`} message={error} />
            </div>
          );
        }}
      </form.Field>

      <form.Field name="notes">
        {(field) => {
          const error = visibleError(field.state.meta);
          return (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name}>Notas de cata</label>
              <textarea
                id={field.name}
                rows={3}
                className="rounded border border-slate-400 bg-white p-2"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${field.name}-error` : undefined}
              />
              <FieldError id={`${field.name}-error`} message={error} />
            </div>
          );
        }}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando…" : "Guardar café"}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
