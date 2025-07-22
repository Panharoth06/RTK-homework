import FormComponent from "@/components/FormComponent";

export default function Page() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-8">Forms</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Existing Form Component */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Form</h2>
          <FormComponent />
        </div>
      </div>
    </div>
  );
}
