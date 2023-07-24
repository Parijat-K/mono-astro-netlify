import { z, defineCollection, ImageFunction } from 'astro:content';

const researchCollection = defineCollection({ 
    type: 'data',
    schema: ({image}) => {
        const baseBlockSchema = z.object({
            type: z.enum(['Column', 'Row', 'Image', 'Paragraph', 'H1', 'H2', 'H3', 'H4']),
            content: z.string().optional(),
            image: image().optional(),
        });

        type Block = z.infer<typeof baseBlockSchema> & {
            items?: Block[] | undefined;
        };
        
        const blockSchema: z.ZodType<Block> = baseBlockSchema.extend({
            items: z.lazy(() => blockSchema.array().optional())
        });

        return z.object({
            title: z.string(),
            coverImage: image(),
            headerImage: image(),
            body: z.lazy(() => blockSchema)
        })
    } 
});

const publicationCollection = defineCollection({ 
    type: 'data',
    schema: () => z.object({
        list: z.array(z.object({
            title: z.string(),
            subtitle: z.string().optional(),
            date: z.string().datetime(),
            authors: z.string().array(),
            publication: z.string(),
            publicationShort: z.string().optional(),
            publicationType: z.enum(['Uncategorized', 'Conference paper', 'Journal article', 'Manuscript', 'Report', 'Book', 'Book section']).default('Uncategorized'),
            abstract: z.string().optional(),
            summary: z.string().optional(),
            doi: z.string().optional(),
            url: z.string().url().optional(),
        })),
    }),
});

export const collections = {
  'research': researchCollection,
  'publication': publicationCollection,
};