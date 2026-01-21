// Minimalist wrapper to avoid full shadcn installation while keeping the code clean
export const Button = ({ children, className, variant, size, asChild, ...props }) => {
    // If it acts as a child (link), we return the child with cloned props
    // For simplicity in this rough implementation, we'll just render the button or the child if it's a link
    // But since we control the usage, we can just use normal button styles

    return (
        <button className={`btn ${variant === 'outline' ? 'btn-outline' : 'btn-primary'} ${className || ''}`} {...props}>
            {children}
        </button>
    )
}
