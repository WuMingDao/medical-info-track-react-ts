import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import AppLayout from "./ui/AppLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />

      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}></Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
