import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  makeAutocomponents,
  ShadcnElements,
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
