import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Textarea } from "./ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "../lib/utils";
import {
  makeAutocomponents,
  type ShadcnElements,
} from "@gadgetinc/react/auto/shadcn";
import { toast } from "sonner";

const elements: ShadcnElements = {
  cn,

  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  toast,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
};

const {
  AutoButton,

  AutoTable,

  AutoForm,

  AutoInput,
  AutoBooleanInput,
  AutoDateTimePicker,
  AutoEmailInput,
  AutoEncryptedStringInput,
  AutoEnumInput,
  AutoFileInput,
  AutoHiddenInput,
  AutoIdInput,
  AutoJSONInput,
  AutoNumberInput,
  AutoPasswordInput,
  AutoRichTextInput,
  AutoRolesInput,
  AutoStringInput,
  AutoTextAreaInput,
  AutoUrlInput,

  AutoBelongsToInput,
  AutoHasManyInput,
  AutoHasManyThroughInput,
  AutoHasOneInput,

  AutoBelongsToForm,
  AutoHasManyForm,
  AutoHasManyThroughForm,
  AutoHasManyThroughJoinModelForm,
  AutoHasOneForm,

  AutoSubmit,
  SubmitErrorBanner,
  SubmitResultBanner,
  SubmitSuccessfulBanner,
} = makeAutocomponents(elements);

export {
  AutoButton,

  AutoTable,

  AutoForm,

  AutoInput,
  AutoBooleanInput,
  AutoDateTimePicker,
  AutoEmailInput,
  AutoEncryptedStringInput,
  AutoEnumInput,
  AutoFileInput,
  AutoHiddenInput,
  AutoIdInput,
  AutoJSONInput,
  AutoNumberInput,
  AutoPasswordInput,
  AutoRichTextInput,
  AutoRolesInput,
  AutoStringInput,
  AutoTextAreaInput,
  AutoUrlInput,

  AutoBelongsToInput,
  AutoHasManyInput,
  AutoHasManyThroughInput,
  AutoHasOneInput,

  AutoBelongsToForm,
  AutoHasManyForm,
  AutoHasManyThroughForm,
  AutoHasManyThroughJoinModelForm,
  AutoHasOneForm,

  AutoSubmit,
  SubmitErrorBanner,
  SubmitResultBanner,
  SubmitSuccessfulBanner,
};
