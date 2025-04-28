import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal", // Makes the route behave like a modal
        headerShown: false, // Hide the header for the modal
      }}
    />
  );
};