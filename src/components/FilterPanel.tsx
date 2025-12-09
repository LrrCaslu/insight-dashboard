import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  roles: string[];
  schools: string[];
  selectedRoles: string[];
  selectedSchools: string[];
  onRolesChange: (roles: string[]) => void;
  onSchoolsChange: (schools: string[]) => void;
}

export function FilterPanel({
  roles,
  schools,
  selectedRoles,
  selectedSchools,
  onRolesChange,
  onSchoolsChange
}: FilterPanelProps) {
  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      onRolesChange(selectedRoles.filter(r => r !== role));
    } else {
      onRolesChange([...selectedRoles, role]);
    }
  };

  const toggleSchool = (school: string) => {
    if (selectedSchools.includes(school)) {
      onSchoolsChange(selectedSchools.filter(s => s !== school));
    } else {
      onSchoolsChange([...selectedSchools, school]);
    }
  };

  const clearFilters = () => {
    onRolesChange([]);
    onSchoolsChange([]);
  };

  const hasFilters = selectedRoles.length > 0 || selectedSchools.length > 0;

  return (
    <div className="bg-card rounded-xl p-6 card-shadow animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Filtros</h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <X className="w-4 h-4" />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Função
          </label>
          <div className="flex flex-wrap gap-2">
            {roles.map(role => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-all duration-200",
                  selectedRoles.includes(role)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Unidade Escolar
          </label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {schools.map(school => (
              <button
                key={school}
                onClick={() => toggleSchool(school)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-all duration-200",
                  selectedSchools.includes(school)
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {school}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
